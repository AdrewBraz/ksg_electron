import ExcelJS from 'exceljs';
import os from 'os';
import path from 'path';
import cloudXlsxSyncConfig from './cloudXlsxSyncConfig';
import { downloadMailRuFile, uploadMailRuFile } from './mailRuCloudClient';

const DAY_MS = 24 * 60 * 60 * 1000;

const normalizeHeaderValue = (value) => {
  if (value && typeof value === 'object' && 'text' in value) {
    return String(value.text).trim();
  }

  return value === undefined || value === null ? '' : String(value).trim();
};

const normalizeKeyValue = (value) => {
  if (value && typeof value === 'object' && 'text' in value) {
    return String(value.text).trim();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return value === undefined || value === null ? '' : String(value).trim();
};

const parseScheduleTime = (scheduleTime) => {
  const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(scheduleTime);

  if (!match) {
    throw new Error(`Invalid CLOUD_XLSX_SYNC_TIME value: ${scheduleTime}. Use HH:mm`);
  }

  return {
    hours: Number(match[1]),
    minutes: Number(match[2]),
  };
};

const getNextRunDate = (scheduleTime, now = new Date()) => {
  const { hours, minutes } = parseScheduleTime(scheduleTime);
  const nextRun = new Date(now);
  nextRun.setHours(hours, minutes, 0, 0);

  if (nextRun <= now) {
    nextRun.setDate(nextRun.getDate() + 1);
  }

  return nextRun;
};

const validateConfig = (config) => {
  if (!config.enabled) {
    return;
  }

  if (!config.query) {
    throw new Error('CLOUD_XLSX_SYNC_QUERY is not configured');
  }

  if (!config.excel.keyColumn) {
    throw new Error('CLOUD_XLSX_SYNC_KEY_COLUMN is not configured');
  }
};

const getWorksheet = (workbook, { sheetName }) => {
  if (sheetName) {
    return workbook.getWorksheet(sheetName) || workbook.addWorksheet(sheetName);
  }

  return workbook.worksheets[0] || workbook.addWorksheet('Sheet1');
};

const getHeaders = (worksheet, headerRowNumber) => {
  const headerRow = worksheet.getRow(headerRowNumber);

  return headerRow.values
    .slice(1)
    .map((value) => normalizeHeaderValue(value));
};

const buildColumns = ({ configuredColumns, headers, rows }) => {
  if (configuredColumns.length > 0) {
    return configuredColumns;
  }

  const existingHeaders = headers.filter(Boolean);
  if (existingHeaders.length > 0) {
    return existingHeaders.map((header) => ({
      header,
      key: header,
    }));
  }

  return Object.keys(rows[0] || {}).map((key) => ({
    header: key,
    key,
  }));
};

const ensureHeaders = ({ worksheet, headerRowNumber, headers, columns }) => {
  if (headers.filter(Boolean).length > 0) {
    return;
  }

  const headerRow = worksheet.getRow(headerRowNumber);
  columns.forEach((column, index) => {
    headerRow.getCell(index + 1).value = column.header;
  });
  headerRow.commit();
};

const getKeyColumnIndex = ({ columns, keyColumn }) => {
  const index = columns.findIndex((column) => (
    column.key === keyColumn || column.header === keyColumn
  ));

  if (index === -1) {
    throw new Error(`Key column "${keyColumn}" was not found in XLSX columns`);
  }

  return index + 1;
};

const collectExistingKeys = ({ worksheet, headerRowNumber, keyColumnIndex }) => {
  const keys = new Set();

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber <= headerRowNumber) {
      return;
    }

    const key = normalizeKeyValue(row.getCell(keyColumnIndex).value);
    if (key) {
      keys.add(key);
    }
  });

  return keys;
};

const appendRowsToWorkbook = async ({ filePath, rows, excel }) => {
  if (rows.length === 0) {
    return 0;
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = getWorksheet(workbook, excel);
  const headers = getHeaders(worksheet, excel.headerRowNumber);
  const columns = buildColumns({
    configuredColumns: excel.columns || [],
    headers,
    rows,
  });

  ensureHeaders({
    worksheet,
    headerRowNumber: excel.headerRowNumber,
    headers,
    columns,
  });

  const keyColumnIndex = getKeyColumnIndex({
    columns,
    keyColumn: excel.keyColumn,
  });
  const existingKeys = collectExistingKeys({
    worksheet,
    headerRowNumber: excel.headerRowNumber,
    keyColumnIndex,
  });

  let appendedRows = 0;
  rows.forEach((row) => {
    const key = normalizeKeyValue(row[excel.keyColumn]);

    if (!key || existingKeys.has(key)) {
      return;
    }

    worksheet.addRow(columns.map((column) => row[column.key]));
    existingKeys.add(key);
    appendedRows += 1;
  });

  if (appendedRows > 0) {
    await workbook.xlsx.writeFile(filePath);
  }

  return appendedRows;
};

const fetchRows = async ({ db, dbConfig, query }) => {
  let connection;

  try {
    connection = await db.getConnection(dbConfig);
    const result = await connection.execute(query);
    return result.rows || [];
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

const runCloudXlsxSync = async ({ db, dbConfig, config, logger }) => {
  const localPath = path.join(os.tmpdir(), config.localFileName);

  logger.info('[cloud-xlsx-sync] Downloading workbook from Mail.ru Cloud');
  await downloadMailRuFile({
    mailRu: config.mailRu,
    destinationPath: localPath,
  });

  logger.info('[cloud-xlsx-sync] Fetching rows from database');
  const rows = await fetchRows({
    db,
    dbConfig,
    query: config.query,
  });

  logger.info(`[cloud-xlsx-sync] Database returned ${rows.length} rows`);
  const appendedRows = await appendRowsToWorkbook({
    filePath: localPath,
    rows,
    excel: config.excel,
  });

  if (appendedRows === 0) {
    logger.info('[cloud-xlsx-sync] Workbook already has all rows; upload skipped');
    return;
  }

  logger.info(`[cloud-xlsx-sync] Appended ${appendedRows} rows; uploading workbook`);
  await uploadMailRuFile({
    mailRu: config.mailRu,
    sourcePath: localPath,
  });
};

export const startCloudXlsxSync = ({ db, dbConfig, logger = console, config = cloudXlsxSyncConfig }) => {
  validateConfig(config);

  if (!config.enabled) {
    logger.info('[cloud-xlsx-sync] Disabled');
    return {
      stop: () => {},
    };
  }

  let timer = null;
  let stopped = false;
  let isRunning = false;

  const scheduleNextRun = () => {
    if (stopped) {
      return;
    }

    const nextRun = getNextRunDate(config.scheduleTime);
    const delay = Math.min(nextRun.getTime() - Date.now(), DAY_MS);
    logger.info(`[cloud-xlsx-sync] Next run: ${nextRun.toLocaleString()}`);
    timer = setTimeout(runOnceAndScheduleNext, delay);
  };

  const runOnceAndScheduleNext = async () => {
    if (isRunning) {
      logger.info('[cloud-xlsx-sync] Previous run is still active; skipping this tick');
      scheduleNextRun();
      return;
    }

    isRunning = true;
    try {
      await runCloudXlsxSync({
        db,
        dbConfig,
        config,
        logger,
      });
    } catch (error) {
      logger.error('[cloud-xlsx-sync] Sync failed', error);
    } finally {
      isRunning = false;
      scheduleNextRun();
    }
  };

  if (config.runOnStart) {
    timer = setTimeout(runOnceAndScheduleNext, 0);
  } else {
    scheduleNextRun();
  }

  return {
    stop: () => {
      stopped = true;
      if (timer) {
        clearTimeout(timer);
      }
    },
  };
};

export default startCloudXlsxSync;
