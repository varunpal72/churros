'use strict';

const prompt = require('prompt');
const optimist = require('optimist');
const fs = require('fs');

prompt.message = "   ";
prompt.delimiter = "";
prompt.override = optimist.argv // allows for properties to be sent as command-line args

console.log('Initializing churros...\n');

const schema = {
  properties: {
    username: {
      required: true,
      description: 'username: '
    },
    password: {
      hidden: true,
      required: true,
      description: 'password: '
    },
    url: {
      default: 'api.cloud-elements.com',
      description: 'url: ',
      before: (value) => {
        if (value.startsWith('localhost')) value = 'http://' + value;
        if (!value.startsWith('http')) value = 'https://' + value;
        return value + '/elements/api-v2';
      }
    }
  }
};

prompt.start();
prompt.get(schema, (err, result) => {
  const propsDir = process.env.HOME + '/.churros/';
  const output = {
    username: result.username,
    password: result.password,
    url: result.url
  }

  if (!fs.existsSync(propsDir)) {
    fs.mkdirSync(propsDir);
  }
  
  writeProperties(propsDir, output);
});

function writeProperties(dir, output) {
  fs.writeFile(dir + '/churros.json', JSON.stringify(output, null, 2), (err) => {
    if (err) {
      return console.log(err);
    }
    console.log('\nFinished initialization of churros');
  });
}
