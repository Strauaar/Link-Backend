const language = require('@google-cloud/language');

class NLP{
  constructor(message){
    this.message = message;
    this.KEY = "AIzaSyCL71w0JZohA6wO2PAXFEb9PJN6_vTs3oA";
  }


  sendReq(){
    const client = new language.LanguageServiceClient();

    const document = {
      content: this.message,
      type: 'PLAIN_TEXT',
    };

    return client
    .analyzeEntities({document: document})
    .catch(err => {
      console.error('ERROR:', err);
    });
  }

  parseService(){
    this.sendReq()
    .then(response =>{
      console.log(response[0].entities[0].name);
    });
  }
}



const post = new NLP("I am looking for a soup kitchen");
post.parseService();