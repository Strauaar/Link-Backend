import config from './config.js';

export const ACCOUNT_SID = process.env.ACCOUNT_SID || config.ACCOUNT_SID;
export const AUTH_TOKEN = process.env.AUTH_TOKEN || config.AUTH_TOKEN;
