import { ACCOUNT_SID, AUTH_TOKEN } from './api_keys.js';

const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);

client.messages.create(
  {
    to: '+16502554232',
    from: '+15109996129',
    body: 'yo',
  },
  (err, message) => {
    console.log(message.sid);
  }
);
