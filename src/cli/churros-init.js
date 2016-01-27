'use strict';

const inquirer = require('inquirer');
const optimist = require('optimist');
const fs = require('fs');
const commander = require('commander');

commander
  .option('-u, --user <user>', 'default CE user to run churros as', '')
  .option('-p, --password <password>', 'password for that user', '')
  .option('-r, --url <url>', 'default CE url to run churros against', '')
  .option('-f, --file </full/path/to/file>', 'props file to use for churros', __dirname + '/assets/sauce.template.json')
  .parse(process.argv);

const validateValue = (value) => value ? true : 'Must enter a value';

const terminate = (msg, args) => {
  console.log(msg, args ? args : '');
  process.exit(1);
};

const buildQuestion = (name, type, message, validate, defaultValue) => {
  return {
    name: name,
    type: type,
    message: message,
    validate: validate,
    default: defaultValue
  };
};

const saveSauce = (answers) => {
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

  const format = (url) => {
    if (url.startsWith('localhost')) url = 'http://' + url;
    if (!url.startsWith('http')) url = 'https://' + url;
    return url;
  };

  var properties = require(commander.file);
  properties.url = format((answers.url || optimist.argv.url));
  properties.user = answers.user || optimist.argv.user;
  properties.password = answers.password || optimist.argv.password;

  fs.writeFile(file, JSON.stringify(properties, null, 2), (err) => {
    err ? terminate('Error while initializing churros', err) : console.log('Finished initializing churros');
  });
};

const questions = [];
if (!optimist.argv.user) questions.push(buildQuestion('user', 'input', 'Default user to run tests:', (value) => validateValue(value)));
if (!optimist.argv.password) questions.push(buildQuestion('password', 'password', 'User\'s password:', (value) => validateValue(value)));
if (!optimist.argv.url) questions.push(buildQuestion('url', 'url', 'Cloud Elements URL', (value) => validateValue(value), 'api.cloud-elements.com'));

inquirer.prompt(questions, (answers) => saveSauce(answers));
