'use strict';

const commander = require('commander');
const fs = require('fs');
const inquirer = require('inquirer');

const terminate = (msg, args) => {
  args ? console.error(msg, args) : console.error(msg);
  process.exit(1);
};

const buildRootPlatformDir = () => __dirname + '/../test';

const buildRootElementDir = () => buildRootPlatformDir() + '/elements';

const buildQuestion = (name, type, message, validate, isDefault) => {
  return {
    name: name,
    type: type,
    message: message,
    validate: validate,
    default: isDefault
  };
};

const validateName = (value) => {
  if (!value) return 'Must enter a name';
  return true;
};

const buildPlatformQuestions = () => {
  return new Promise((res, rej) => {
    res([
      buildQuestion('name', 'input', 'Platform resource name:', (value) => validateName(value))
    ]);
  });
};

const buildElementQuestions = () => {
  return new Promise((res, rej) => {
    res([
      buildQuestion('name', 'input', 'Element name:', (value) => validateName(value)),
      buildQuestion('hub', 'input', 'Hub name:', (value) => validateName(value)),
    ]);
  });
};

const buildResourceQuestions = () => {
  return [
    buildQuestion('resource', 'input', 'Resource name (CE name):', (value) => validateName(value)),
    buildQuestion('vendor', 'input', 'Vendor resource name:', (value) => validateName(value)),
    buildQuestion('id', 'input', 'Vendor ID field:', (value) => validateName(value)),
  ];
};

const askQuestions = (questions) => new Promise((res, rej) => inquirer.prompt(questions, (answers) => res(answers)));

const stubPlatformFiles = (r) => {
  console.log(r);
  return r;
};

const stubElementFiles = (r) => {
  console.log(r);
  return r;
};

const stubResourceFiles = (r) => {
  console.log(r);
  return r;
};

const add = (type, options) => {
  if (type === 'element') {
    buildElementQuestions(type)
      .then(r => askQuestions(r))
      .then(r => stubElementFiles(r))
      .then(r => askQuestions(buildResourceQuestions()))
      .then(r => stubResourceFiles(r))
      .catch(r => terminate(r));
  } else if (type === 'platform') {
    buildPlatformQuestions(type)
      .then(r => askQuestions(r))
      .then(r => stubPlatformFiles(r))
      .catch(r => terminate(r));
  } else {
    terminate('Invalid type: %s', type);
  }
};

commander
  .command('suite type', '[element || platform]')
  .action((type, options) => add(type, options))
  .on('--help', () => {
    console.log('  Examples:');
    console.log('');
  })
  .parse(process.argv);
