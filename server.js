import { ACCOUNT_SID, AUTH_TOKEN } from './api_keys.js';
import express from 'express';
import bodyParser from 'body-parser';

const http = require('http');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('hi');
});


app.post('/sms', (req, res) => {
  console.log(req.body.body);
  let twiml = new MessagingResponse();
  twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});


http.createServer(app).listen(process.env.PORT || 1337, () => {
  console.log('Express server is listening...');
});
