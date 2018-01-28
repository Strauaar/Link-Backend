const Converser = require("./converser.js");
const readline = require('readline');
const defaultQuery = {service: null, address: null};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// const user = {address: "sf"}

function getInput(query){
  let converser = new Converser(query);
  rl.question('> ', input => {
    converser.receiveText(input).then((response) => {
      //save query to DB
      //response ==> {query: {}, message: "TEXT ME TO USER"}
      query = response.query;
      console.log(response.message);
      getInput(query);
    });
  });
}

//receive text
// if query exists with text number create converser with query
// else create converser with no query 
//pass text message to converser.receive(text)
//resolve promise 
// save query to DB 
// send message to user 

getInput();

// export GOOGLE_APPLICATION_CREDENTIALS=/"/Users/julian/Desktop/hackathon/service_key.json"
