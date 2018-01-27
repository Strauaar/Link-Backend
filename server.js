import { ACCOUNT_SID, AUTH_TOKEN } from './api_keys.js';
import express from 'express';
import bodyParser from 'body-parser';

const { Client } = require('pg');
const http = require('http');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);
// client.messages
//   .create({
//     to: '+15558675310',
//     from: '+15017122661',
//     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
//   })
//   .then(message => console.log(message.sid));

const app = express();
const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

db.connect();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('hi');
});


app.post('/sms', (req, res) => {
  //text body
  const body = req.body.Body;
  //number is in string format '+1XXXXXXXXXX'
  const number = req.body.From;
  db.query('INSERT INTO users (number) VALUES ($1) ON CONFLICT ON CONSTRAINT number DO NOTHING;', [number], (err, res) => {
    if (err) throw err;
    client.end();
  });

  // console.log(req);
  let twiml = new MessagingResponse();

  twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());

});


http.createServer(app).listen(process.env.PORT || 1337, () => {
  console.log('Express server is listening...');
});
