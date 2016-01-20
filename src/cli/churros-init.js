'use strict';

const prompt = require('prompt');
const optimist = require('optimist');
const fs = require('fs');
const commander = require('commander');
const nodegit = require('nodegit');

commander
  .option('-u, --user <user>', 'default CE user to run churros as', '')
  .option('-p, --password <password>', 'password for that user', '')
  .option('-r, --url <url>', 'default CE url to run churros against', '')
  .option('-f, --file </full/path/to/file>', 'props file to use for churros', __dirname + '/assets/sauce.template.json')
  .parse(process.argv);

console.log('Initializating churros...');

prompt.message = "   ";
prompt.delimiter = "";
prompt.override = optimist.argv // allows for properties to be sent as command-line args

const prompts = {
  properties: {
    user: {
      required: true,
      description: 'Enter the default CE user to run churros as: '
    },
    password: {
      hidden: true,
      required: true,
      description: 'Enter the password for that user: '
    },
    url: {
      default: 'api.cloud-elements.com',
      description: 'Enter the default URL to run churros against: ',
      before: (url) => {
        if (url.startsWith('localhost')) url = 'http://' + url;
        if (!url.startsWith('http')) url = 'https://' + url;
        return url;
      }
    }
  }
};

prompt.start();
prompt.get(prompts, (err, result) => {
  const propsDir = process.env.HOME + '/.churros/';
  const file = propsDir + 'sauce.json';

  console.log('Saving default properties to ' + file);

  // directory doesn't exist? create it
  if (!fs.existsSync(propsDir)) fs.mkdirSync(propsDir);

  // load file and append our properties to it so we don't override properties that could already be there
  if (!fs.existsSync(commander.file)) {
    console.log("No default property file found at this location: %s", commander.file);
    process.exit(1);
  }

  var properties = require(commander.file);
  properties.user = result.user;
  properties.password = result.password;
  properties.url = result.url;

  fs.writeFile(file, JSON.stringify(properties, null, 2), (err) => {
    if (err) {
      console.log('Error while initializing churros');
      return console.log(err);
    }
    console.log('Finished initializing churros');
    process.exit(0);
  });
});
