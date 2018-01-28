const NLP = require('./NLP.js');
const GoogleMap = require("./google_map");
const Promise = require("es6-promise");

const sampleTexts = "'I am looking for a homeless shelter' or 'I need counseling'";

// STATUSES
const NEW_QUERY = "NEW_QUERY";
const AWAIT_SERVICE = "AWAIT_SERVICE";
const AWAIT_ADDRESS = "AWAIT_ADDRESS";
const CONFIRMING_ADDRESS = "CONFIRMING_ADDRESS";
const COMPLETED = "COMPLETED";

const newQuery = {service: null, address: null, status: NEW_QUERY};
const nullUser = {address: null};

class Converser{
  constructor(query = newQuery, user = nullUser ){
    this.query = query;
    this.user = user;
    //skip intro text for repeat users
    if (user.address && this.query.status === NEW_QUERY){
      this.query.status = AWAIT_SERVICE;
    }
  }

  receiveText(text){
    const actions = {
      NEW_QUERY: this.sendIntroText,
      AWAIT_SERVICE: this.receiveService,
      AWAIT_ADDRESS: this.receiveAddress,
      CONFIRMING_ADDRESS: this.confirmAddress
    };
    if (this.checkForTriggers(text)){
      return this.handleTrigger();
    } 
    const status = this.query.status;
    if (status){
      return actions[status](text);
    } else{
      return this.sendIntroText();
    }
    //   else if (this.query.status === NEW_QUERY){
    //   return this.sendIntroText();
    // } else if (this.query.status === AWAIT_SERVICE){
    //   return this.receiveService(text);
    // } else if (this.query.status === AWAIT_ADDRESS){
    //   return this.receiveAddress(text);
    // } else if (this.query.status === CONFIRMING_ADDRESS ){
    //   return this.confirmAddress(text);
      // should never get here
    // } else {
    //   return this.sendIntroText();
    // }
  }
  checkForTriggers(text){
    console.log(text);
    const triggers = ["suicide", "death", "dead", "kill", " die "];
    return triggers.some(trigger => (
      text.includes(trigger)
    ));
  }
  handleTrigger(){
    let promise = new Promise((resolve, reject) => {
      const message = "Help is just a phone call away. Call 1-800-273-8255 now for 24/7 support";
      this.query.status = COMPLETED;
      resolve({query: this.query, message });
    });
    return promise;
  }

  sendIntroText(){
    let promise = new Promise((resolve, reject) => {
      const message = "Welcome to Link. How can we help you. You can try " + sampleTexts;
      this.query.status = AWAIT_SERVICE;
      resolve({query: this.query, message });
    });
    return promise;
  }
  
  receiveService(text){
    let message;
    let promise = new Promise((resolve, reject) => {
      const parser = new NLP(text);
      parser.parseService().then(entities => {
        if (this.handleEntities(entities)){            
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
    this.query.address = text;
    return this.fulfillQuery();
  }

  confirmAddress(text){
    if (text.includes("y")){
      this.query.address = this.user.address;
      return this.fulfillQuery();
    } else { // user does not want to use cached address
      let promise = new Promise((resolve, reject) => {
        this.query.status = AWAIT_ADDRESS;
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
      this.query.status = AWAIT_ADDRESS;
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

  handleEntities(entities){
    if (entities.length > 0){
    //  this.query["service"] = entities[0];
     this.query["service"] = entities.join(" ");
     return true;
    } else{
      return false;
    }
  }

}
module.exports = Converser;

