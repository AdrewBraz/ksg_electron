const env = process.env;

const toNumber = (value, fallback) => {
  const result = Number(value);
  return Number.isFinite(result) ? result : fallback;
};

const parseColumns = (value) => {
  if (!value) {
    return [];
  }

  try {
    const columns = JSON.parse(value);
    if (!Array.isArray(columns)) {
      return [];
    }

    return columns.filter((column) => column.header && column.key);
  } catch {
    return [];
  }
};

const cloudXlsxSyncConfig = {
  enabled: env.CLOUD_XLSX_SYNC_ENABLED === 'true',
  scheduleTime: env.CLOUD_XLSX_SYNC_TIME || '21:00',
  runOnStart: env.CLOUD_XLSX_SYNC_RUN_ON_START === 'true',
  localFileName: env.CLOUD_XLSX_SYNC_LOCAL_FILE_NAME || 'mailru-cloud-sync.xlsx',
  query: env.CLOUD_XLSX_SYNC_QUERY || '',
  mailRu: {
    login: env.MAILRU_CLOUD_LOGIN || '',
    password: env.MAILRU_CLOUD_PASSWORD || '',
    webDavBaseUrl: env.MAILRU_CLOUD_WEBDAV_URL || 'https://webdav.cloud.mail.ru',
    remotePath: env.MAILRU_CLOUD_XLSX_PATH || '',
  },
  excel: {
    sheetName: env.CLOUD_XLSX_SYNC_SHEET || '',
    headerRowNumber: toNumber(env.CLOUD_XLSX_SYNC_HEADER_ROW, 1),
    keyColumn: env.CLOUD_XLSX_SYNC_KEY_COLUMN || 'ID',
    columns: parseColumns(env.CLOUD_XLSX_SYNC_COLUMNS),
  },
};

export default cloudXlsxSyncConfig;
