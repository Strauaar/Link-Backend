const https = require("https");
var Promise = require('es6-promise').Promise;

class GoogleMap {
  constructor(type, address) {
    this.type = type;
    this.address = address;
  }

  getText() {
    let query = "homeless" + this.type;
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${this.address}+${query}s&key=AIzaSyBCVhmLyklsarcKC9WCVH12rEhjemNNxKw`;
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
            let nearest = body.results[0];
            let second = body.results[1];
            let third = body.results[2];
            response = `Nearest ${this.type} are ${nearest.name} at ${nearest.formatted_address}; ${second.name} at ${second.formatted_address}; and ${third.name} at ${third.formatted_address}`;
          }
          resolve(response);
        });
      });
    });
    return promise;
  }
}



let g = new GoogleMap("shelter", "587 eddy st sf");
console.log(g);
g.getText().then(res => console.log(res));