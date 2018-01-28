const NLP = require('./NLP.js');
const GoogleMap = require("./google_map");
const Promise = require("es6-promise");

const sampleTexts = "'I am looking for a homeless shelter' or  'I need drug counseling'";

// STATUSES
const FILLING_QUERY = "FILLING_QUERY";
const CONFIRMING_ADDRESS = "CONFIRMING_ADDRESS";
const COMPLETED = "COMPLETED";

const defaultQuery = {service: null, address: null, status: "FILLING_QUERY"};
const nullUser = {address: null};

class Converser{
  constructor(query = defaultQuery, user = nullUser ){
    this.query = query;
    this.user = user;
  }

  receiveText(text){
    if (!this.query.service){
      return this.receiveService(text);
    } else{
      return this.receiveAddress(text);
    }
  }

  receiveService(text){
    let message;
    let promise = new Promise((resolve, reject) => {
      const parser = new NLP(text);
      parser.parseService().then(entities => {
        if (this.handleEntites(entities)){            
          message = this.addressQuery();
          // save to DB
        } else{
          message = "Sorry, I wasn't able to understand that. Try " + sampleTexts;
        }
        resolve({query: this.query, message});
      });
    });
    return promise;
  }

  receiveAddress(text){
    if (this.query.status === CONFIRMING_ADDRESS && text.includes("y")){
      this.query.address = this.user.address;
      return this.fulfillQuery();
    } else if (this.query.status !== CONFIRMING_ADDRESS){
      this.query.address = text;
      return this.fulfillQuery();
    } else { // user does not want to use cached address
      let promise = new Promise((resolve, reject) => {
        this.query.status = FILLING_QUERY;
        const message = this.addressQuery(false);
        resolve({query: this.query, message});
      });
      return promise;
    }
  }

  addressQuery(useCachedAddress = true){
    let message;
    if (useCachedAddress && this.user.address){
      this.query.status = CONFIRMING_ADDRESS;
      message =  "I have your last location as: " + this.user.address + ". Is that still correct?";
    } else{
      message = "Where are you right now? (ex. 587 Eddy St. San Francisco)";
    }
    return message;
  }

  fulfillQuery(){  
    let message;  
    const promise = new Promise((resolve, reject) => {
      const googleMap = new GoogleMap(this.query.service, this.query.address);
      googleMap.getText()
        .then(response => {
          message = response;
          this.query.status = COMPLETED;
          resolve({query:this.query, message});
        });
    });
    return promise;
  }

  handleEntites(entities){
    if (entities.length > 0){
    //  this.query["service"] = entities[0];
     this.query["service"] = entities;
     return true;
    } else{
      return false;
    }
  }

}
module.exports = Converser;

  // receiveText(text){
  //   let response;
  //   let promise = new Promise((resolve, reject) => {
  //     if (!this.query["service"]){
  //       const parser = new NLP(text);
  //       parser.parseService().then(entities => {
  //         if (this.handleEntites(entities)){
  //           response = "Where are you currently? (ex. 587 Eddy St.)";
  //           // save to DB
  //         } else{
  //           response = "Sorry, I wasn't able to understand that. Try " + sampleTexts;
  //         }
  //         console.log(response);
  //       });
  //     } else{
  //       this.query["address"] = text;
  //       const googleMap = new GoogleMap(this.query.service, this.query.address);
  //       googleMap.getText()
  //         .then(console.log);
  //       // response = this.lookupQuery(this.query.service, this.query.address);
  //       // console.log(response);
  //     }
  //     resolve(this.query);
  //   });
  //   return promise;
  // }