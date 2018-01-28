const https = require("https");
var Promise = require('es6-promise').Promise;

class GoogleMap {
  constructor(type, address) {
    this.type = type;
    this.address = address;
    this.API_KEY = process.env.GOOGLE_API_KEY;
  }

  validAddress() {
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${this.address}&key=${this.API_KEY}`;
    let body = '';

    let promise = new Promise((resolve, reject) => {
      let response;
      https.get(url, resp => {
        resp.on("data", data => {
          body += data;
        });
        resp.on("end", () => {
          body = JSON.parse(body);

          if (body.status === "ZERO_RESULTS") {
            response = false;
          } else {
            response = true;
          }
          resolve(response);
        });
      });
    });
    return promise;
  }

  getText() {
    let query = "homeless " + this.type.join(" ");
    console.log(query);
    // let query = this.type;
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${this.address}+${query}&key=AIzaSyCL71w0JZohA6wO2PAXFEb9PJN6_vTs3oA`;
    let body = '';

    let promise = new Promise( (resolve, reject) => {
      let response;
      https.get(url, resp => {
        resp.on("data", data => {
          body += data;
        });
        resp.on("end", () => {
          body = JSON.parse(body);

          if (body.status === "ZERO_RESULTS") {
            response = "No results found";
          } else {
            // let nearest = body.results[0];
            // let second = body.results[1];
            // let third = body.results[2];
            // response = `Nearest ${this.type} are ${nearest.name} at ${nearest.formatted_address}; ${second.name} at ${second.formatted_address}; and ${third.name} at ${third.formatted_address}`;
            const results = body.results.slice(0,3);
            const resultsString = results.map(result => (`${result.name} at ${result.formatted_address}`))
              .join("; ");
            response = `Nearest ${this.type} are ${resultsString}`;
          }
          resolve(response);
        });
      });
    });
    return promise;
  }
}

module.exports = GoogleMap;

// let g = new GoogleMap("shelter", "587 eddy st sf");
// console.log(g);
// g.getText().then(res => console.log(res));
