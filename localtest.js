const Converser = require("./converser.js");
const readline = require('readline');
const defaultQuery = {service: null, address: null};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getInput(query){
  let converser = new Converser(query);
  rl.question('> ', input => {
    converser.receiveText(input).then(response => {
      query = response;
      getInput(query);
    });
  });
}
// getInput({service: "doctor", address: null});
getInput();

// export GOOGLE_APPLICATION_CREDENTIALS=/"/Users/julian/Desktop/hackathon/service_key.json" 