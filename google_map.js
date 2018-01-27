const https = require("https");

class GoogleMap {
  constructor(type, address) {
    this.type = type;
    this.address = address;
  }

  getText() {
    let query = "homeless" + this.type;
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${this.address}+${query}s&key=AIzaSyBCVhmLyklsarcKC9WCVH12rEhjemNNxKw`;
    let body = '';
    https.get(url, resp => {
      resp.on("data", data => {
        body += data;
      });
      resp.on("end", () => {
        body = JSON.parse(body);

        if (body.status === "ZERO_RESULTS") {
          return "No results found";
        } else {
          let nearest = body.results[0];
          let second = body.results[1];
          let third = body.results[2];
          return `Nearest ${this.type} are ${nearest.name} at ${nearest.formatted_address}; ${second.name} at ${second.formatted_address}; and ${third.name} at ${third.formatted_address}`;
        }
      });
    });
  }
}


let g = new GoogleMap("shelter", "587 eddy st sf");
// console.log(g);
console.log(g.getText());