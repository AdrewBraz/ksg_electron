import axios from 'axios';
import fs from 'fs';

const trimEndSlash = (value) => value.replace(/\/+$/, '');

const encodeRemotePath = (remotePath) => remotePath
  .split('/')
  .filter(Boolean)
  .map((part) => encodeURIComponent(part))
  .join('/');

const createRemoteUrl = ({ webDavBaseUrl, remotePath }) => {
  if (!webDavBaseUrl) {
    throw new Error('Mail.ru WebDAV URL is not configured');
  }

  if (!remotePath) {
    throw new Error('Mail.ru remote XLSX path is not configured');
  }

  return `${trimEndSlash(webDavBaseUrl)}/${encodeRemotePath(remotePath)}`;
};

const createAuth = ({ login, password }) => {
  if (!login || !password) {
    throw new Error('Mail.ru credentials are not configured');
  }

  return {
    username: login,
    password,
  };
};

export const downloadMailRuFile = async ({ mailRu, destinationPath }) => {
  const response = await axios.get(createRemoteUrl(mailRu), {
    auth: createAuth(mailRu),
    responseType: 'arraybuffer',
  });

  fs.writeFileSync(destinationPath, Buffer.from(response.data));
};

export const uploadMailRuFile = async ({ mailRu, sourcePath }) => {
  await axios.put(createRemoteUrl(mailRu), fs.createReadStream(sourcePath), {
    auth: createAuth(mailRu),
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });
};
