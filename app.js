const express = require('express');
const app = express();
const https = require("https");

app.listen(3000, () => console.log('Example app listening on port 3000!'));

app.get('/', (req, res) => res.send('Hello World!'));

// Endpoint for web app to grab 20 shelters or soup kitchens in SF
// :type should either be 'food' or 'shelter'
app.get('/locations/:type', function (req, res) {
  let type = req.params.type;
  let address = "san francisco";
  let query = "homeless " + type;
  console.log(query);
  let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${address}+${query}s&key=AIzaSyBCVhmLyklsarcKC9WCVH12rEhjemNNxKw`;
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

// Returns 
app.get('/location_detailed/:placeid', function (req, res) {
  let placeid = req.params.placeid;
  let url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeid}&key=AIzaSyBCVhmLyklsarcKC9WCVH12rEhjemNNxKw`;
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
  let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${address}+${query}s&key=AIzaSyBCVhmLyklsarcKC9WCVH12rEhjemNNxKw`;
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