'use strict';

const prompt = require('prompt');
const optimist = require('optimist');

prompt.message = "   ";
prompt.delimiter = "";

prompt.override = optimist.argv

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
      before: function (value) {
        if (value.startsWith('localhost')) {
          value = 'http://' + value;
        }

        if (!value.startsWith('http')) {
          value = 'https://' + value;
        }

        return value + '/elements/api-v2';
      }
    }
  }
};

prompt.start();

prompt.get(schema, function (err, result) {
  console.log('  username: ' + result.username);
  console.log('  password: ' + result.password);
  console.log('  url: ' + result.url);

  console.log('\nFinished initialization of churros');
});
