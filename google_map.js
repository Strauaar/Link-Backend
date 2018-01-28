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
    let query = this.address + " homeless " + this.type.join(" ");
    // let query = this.type;
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${this.API_KEY}`;
    let body = '';
    console.log(url);
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
            const results = body.results.slice(0,3);
            const resultsString = results.map(result => (`${result.name} at ${result.formatted_address}`))
              .join(";\n ");
            response = `Nearest ${this.type}s are: \n ${resultsString}`;
          }
          resolve(response);
        });
      });
    });
    return promise;
  }
}

module.exports = GoogleMap;

