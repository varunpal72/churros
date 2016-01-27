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

const askQuestions = (questions) => new Promise((res, rej) => inquirer.prompt(questions, (answers) => res(answers)));

const validateValue = (value) => value ? true : 'Must enter a value';

const buildQuestion = (name, type, message, validate, isDefault) => {
  return {
    name: name,
    type: type,
    message: message,
    validate: validate,
    default: isDefault
  };
};

const buildPlatformQuestions = () =>
  new Promise((res, rej) => {
    res([
      buildQuestion('name', 'input', 'Platform resource name:', (value) => validateValue(value))
    ]);
  });

const buildElementQuestions = () =>
  new Promise((res, rej) => {
    res([
      buildQuestion('name', 'input', 'Element name:', (value) => validateValue(value)),
      buildQuestion('hub', 'input', 'Hub name:', (value) => validateValue(value)),
    ]);
  });

const buildResourceQuestions = () => [
  buildQuestion('name', 'input', 'Resource name (CE name):', (value) => validateValue(value)),
  buildQuestion('vendorName', 'input', 'Vendor resource name:', (value) => validateValue(value)),
  buildQuestion('vendorId', 'input', 'Vendor ID field:', (value) => validateValue(value)),
  buildQuestion('more', 'confirm', 'Add more resources:')
];

const askResourceQuestions = (output) => {
  output = output || [];
  return new Promise((res, rej) => {
    inquirer.prompt(buildResourceQuestions(), (answers) => {
      output.push(answers);
      return answers.more ? askResourceQuestions(output).then(r => res(r)) : res(output);
    });
  });
};

const stubPlatformFiles = (r) => {
  return r;
};

const stubElementFiles = (r) => {
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
      .then(r => askResourceQuestions())
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
