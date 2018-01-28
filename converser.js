const NLP = require('./NLP.js');
const sampleTexts = "'I am looking for a homeless shelter' or  'I need drug counseling'";
const defaultQuery = {service: null, address: null};

class Converser{
  constructor(query = defaultQuery, user){
    this.query = query;
    console.log(query);
  }
  
  receiveText(text){
    let response;
    let promise = new Promise((resolve, reject) => {
      if (!this.query["service"]){
        const parser = new NLP(text);
        parser.parseService().then(entities => {
          if (this.handleEntites(entities)){
            response = "Where are you currently? (ex. 587 Eddy St.)";
            // save to DB
          } else{
            response = "Sorry, I wasn't able to understand that. Try " + sampleTexts;
          }
          console.log(response);
        });
      } else{
        this.query["address"] = text;
        response = this.lookupQuery(this.query.service, this.query.address);
        console.log(response);
      }
      resolve(this.query);
    });
    return promise;
  }

  handleEntites(entities){
    if (entities.length > 0){
     this.query["service"] = entities[0];
     return true;
    } else{
      return false;
    }
  }

  lookupQuery(type, address){
    const response = `Here are the nearest ${type}s to ${address}: Thing1, Thing2 Thing3`;
    return response;
  }

  returnResponse(response){
    console.log(response);
  }

}
module.exports = Converser;