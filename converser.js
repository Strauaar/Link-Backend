const NLP = require('./NLP.js');
const sampleTexts = "'I am looking for a homeless shelter' or  'I need drug counseling'";
const defaultQuery = {service: null, address: null};

class Converser{
  constructor(query = defaultQuery, user){
    this.query = query;
  }
  
  receiveText(text){
    const response = "";
    if (!this.service){
      const parser = new NLP(text);
      const entities = parser.parseService();
      if (this.handleEntites(entities)){
        response = "Where are you currently? (ex. 587 Eddy St.";
      } else{
        response = "Sorry, I wasn't able to understand that. Try" + sampleTexts;
      }
    }
    this.returnRespose(response);
  }

  handleEntites(entities){
    if (entities.length > 0){
     this.query["service"] = entities[0];
     return true;
    } else{
      return false;
    }
  }

  returnResponse(response){
    console.log(response);
  }

}