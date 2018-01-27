const express = require('express');
const app = express();
const https = require("https");

app.listen(3000, () => console.log('Example app listening on port 3000!'));

app.get('/', (req, res) => res.send('Hello World!'));

// app.get('/shelter/:address', function(req, res) {
//   let address = req.params.address;
//   let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${address}+homeless+shelters&key=AIzaSyBCVhmLyklsarcKC9WCVH12rEhjemNNxKw`;
//   let body = '';

//   https.get(url, resp => {
//     resp.on("data", data => {
//       body += data;
//     });
//     resp.on("end", () => {
//       body = JSON.parse(body);
      
//       if (body.status === "ZERO_RESULTS") {
//         res.send("No results found");
//       } else {
//         let nearest = body.results[0];
//         let second = body.results[1];
//         let third = body.results[2];
//         res.send(`Nearest shelters are ${nearest.name} at ${nearest.formatted_address}; ${second.name} at ${second.formatted_address}; and ${third.name} at ${third.formatted_address}`);
//       }
//     });
//   });
// });

// app.get('/food/:address', function(req, res) {
//   let address = req.params.address;
//   let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${address}+homeless+meals&key=AIzaSyBCVhmLyklsarcKC9WCVH12rEhjemNNxKw`;
//   let body = '';

//   https.get(url, resp => {
//     resp.on("data", data => {
//       body += data;
//     });
//     resp.on("end", () => {
//       body = JSON.parse(body);

//       if (body.status === "ZERO_RESULTS") {
//         res.send("No results found");
//       } else {
//         let nearest = body.results[0];
//         let second = body.results[1];
//         let third = body.results[2];
//         res.send(`Nearest meals are ${nearest.name} at ${nearest.formatted_address}; ${second.name} at ${second.formatted_address}; and ${third.name} at ${third.formatted_address}`);
//       }
//     });
//   });
// });

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