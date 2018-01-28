import { ACCOUNT_SID, AUTH_TOKEN, GOOGLE_API_KEY } from './api_keys.js';
import express from 'express';
import bodyParser from 'body-parser';
// import * as DBUtil from './db_util.js';
const http = require('http');
const https = require("https");
const { Client } = require('pg');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const Converser = require("./converser.js");
const defaultQuery = {service: null, address: null};
const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);

// client.messages
//   .create({
//     to: '+16502554232',
//     from: '+15109996129',
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

  db.query('INSERT INTO users (number, created_at) VALUES ($1, $2) ON CONFLICT (number) DO NOTHING;', [number, new Date()])
    .catch(e => console.error(e.stack));

  db.query('SELECT * FROM queries JOIN users ON users.id = queries.user_id WHERE users.number = ($1);', [number], (err, res) => {
    if (err) {
      throw err
    } else if (res.rows.length === 0) {
      let converser = new Converser();
      converser.receiveText(body)
      .then(res => {
        let toSend = res.text;
        let newQuery = res.query;
        let twiml = new MessagingResponse();
        twiml.message(toSend);
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
        const { service, address, status } = converser.query;
        db.query('INSERT INTO queries (service, address, status ) VALUES ($1, $2, $3);', [service, address, status])
        .catch(e => console.error(e.stack))
      })
      .catch(e => console.error(e.stack))
    } else {
      let row = res.row[0]
      let query = {row['service'], row['address'], row['status']};
      let converser = new Converser(query);
      converser.receiveText(body)
      .then(res => {
        let toSend = res.text;
        let newQuery = res.query;
        let twiml = new MessagingResponse();
        twiml.message(toSend);
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
        const { service, address, status } = converser.query;
        db.query('UPDATE queries SET service = ($1), address = ($2), status = ($3) WHERE user_id IN (SELECT id FROM users WHERE number = ($4));', [service, address, status, number], [service, address, status])
          .catch(e => console.error(e.stack))
      })
      .catch(e => console.error(e.stack))
      // let twiml = new MessagingResponse();
      // twiml.message('The Robots are coming! Head for the hills!');
      // res.writeHead(200, {'Content-Type': 'text/xml'});
      // res.end(twiml.toString());
    }
    db.end();
  });


});

// Endpoint for web app to grab 20 shelters or soup kitchens in SF
// :type should either be 'food' or 'shelter'
app.get('/locations/:type', function (req, res) {
  let type = req.params.type;
  let address = "san francisco";
  let query = "homeless " + type;
  console.log(query);
  let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${address}+${query}s&key=${GOOGLE_API_KEY}
`;
  let body = '';

  https.get(url, resp => {
    resp.on("data", data => {
      body += data;
    });
    resp.on("end", () => {
      body = JSON.parse(body);
      res.json(body.results);
    });
  });
});

app.get('/location_detailed/:placeid', function (req, res) {
  let placeid = req.params.placeid;
  let url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeid}&key=${GOOGLE_API_KEY}
`;
  let body = '';

  https.get(url, resp => {
    resp.on("data", data => {
      body += data;
    });
    resp.on("end", () => {
      body = JSON.parse(body);
      res.json(body);
    });
  });
});

app.get('/:type/:address', function (req, res) {
  let type = req.params.type;
  let address = req.params.address;
  let query = "homeless" + type;
  let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${address}+${query}s&key=${GOOGLE_API_KEY}
`;
  let body = '';

  https.get(url, resp => {
    resp.on("data", data => {
      body += data;
    });
    resp.on("end", () => {
      body = JSON.parse(body);

      if (body.status === "ZERO_RESULTS") {
        res.send("No results found");
      } else {
        let nearest = body.results[0];
        let second = body.results[1];
        let third = body.results[2];
        res.send(`Nearest ${type} are ${nearest.name} at ${nearest.formatted_address}; ${second.name} at ${second.formatted_address}; and ${third.name} at ${third.formatted_address}`);
      }
    });
  });
});

http.createServer(app).listen(process.env.PORT || 1337, () => {
  console.log('Express server is listening...');
});
