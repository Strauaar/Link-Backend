import { ACCOUNT_SID, AUTH_TOKEN } from './api_keys.js';
import express from 'express';

const http = require('http');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);

const app = express();

// client.messages.create(
//   {
//     to: '+16502554232',
//     from: '+15109996129',
//     body: 'yo',
//   },
//   (err, message) => {
//     console.log(message.sid);
//   }
// );

app.get('/', (req, res) => {
  res.send('hi');
});


app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});
