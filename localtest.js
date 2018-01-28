const Converser = require("./converser.js");
const readline = require('readline');
const defaultQuery = {service: null, address: null};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const user = {address: "sf"}

function getInput(query){
  let converser = new Converser(query, user);
  rl.question('> ', input => {
    converser.receiveText(input).then((response) => {
      query = response.query;
      console.log(response.message);
      getInput(query);
    });
  });
}

getInput();

// export GOOGLE_APPLICATION_CREDENTIALS=/"/Users/julian/Desktop/hackathon/service_key.json"
