'use strict';

const commander = require('commander');
const fs = require('fs');
const inquirer = require('inquirer');
const replaceStream = require('replacestream');

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

const askResourceQuestions = (r, resources) => {
  resources = resources || [];
  return new Promise((res, rej) => {
    inquirer.prompt(buildResourceQuestions(), (answers) => {
      resources.push(answers);
      if (answers.more) askResourceQuestions(r, resources).then(resource => res(resource));
      else {
        r.resources = resources;
        res(r);
      }
    });
  });
};

const stubPlatformFiles = (r) =>
  new Promise((res, rej) => {
    const rootDir = buildRootPlatformDir();
    const suiteDir = rootDir + '/' + r.name;
    if (fs.existsSync(suiteDir)) terminate('Platform suite %s already exists', r.name);

    // main suite files
    fs.mkdirSync(suiteDir);
    const jsFile = suiteDir + '/' + r.name + '.js';
    fs.createReadStream(__dirname + '/assets/platform.suite.template.js')
      .pipe(replaceStream('%name', r.name))
      .pipe(replaceStream('%user', process.env.USER))
      .pipe(fs.createWriteStream(jsFile));

    // asset files
    const assetsDir = suiteDir + '/assets';
    fs.mkdirSync(assetsDir);
    const schemaFile = assetsDir + '/' + r.name + '.schema.json';
    fs.createReadStream(__dirname + '/assets/resource.schema.template.json')
      .pipe(fs.createWriteStream(schemaFile));

    res(r);
  });

const stubElementFiles = (r) =>
  new Promise((res, rej) => {
    const rootDir = buildRootElementDir();
    const suiteDir = rootDir + '/' + r.name;
    if (!fs.existsSync(suiteDir)) fs.mkdirSync(suiteDir);

    const assetsDir = suiteDir + '/assets';
    if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir);

    const transformationsFile = assetsDir + '/transformations.json';
    if (!fs.existsSync(transformationsFile)) fs.writeFileSync(transformationsFile, '{}');

    r.resources.forEach(resource => {
      const name = resource.name;
      const vendorName = resource.vendorName;
      const vendorId = resource.vendorId;

      // resource .js file
      const resourceJsFile = suiteDir + '/' + name + '.js';
      if (!fs.existsSync(resourceJsFile)) {
        fs.createReadStream(__dirname + '/assets/element.suite.template.js')
          .pipe(replaceStream('%resource', name))
          .pipe(replaceStream('%hub', r.hub))
          .pipe(replaceStream('%user', process.env.USER))
          .pipe(fs.createWriteStream(resourceJsFile));
      } else {
        console.log('test .js file already exists for %s so not modifying', name);
      }

      // schema file
      const resourceSchemaFile = assetsDir + '/' + name + '.schema.json';
      if (!fs.existsSync(resourceSchemaFile)) {
        fs.createReadStream(__dirname + '/assets/resource.schema.template.json')
          .pipe(fs.createWriteStream(resourceSchemaFile));
      } else {
        console.log('schema file already exists for %s so not modifying', name);
      }

      // transformation file
      const currentTransformations = require(transformationsFile);
      if (!currentTransformations[name]) {
        currentTransformations[name] = {
          vendorName: vendorName,
          fields: [{
            path: 'id',
            vendorPath: vendorId
          }]
        };
        fs.writeFileSync(transformationsFile, JSON.stringify(currentTransformations, null, 2));
      } else {
        console.log('transformation for %s already exists for %s', name, r.name);
      }
    });

    res(r);
  });

const showElementAdvice = (r) => {
  console.log('Successfully stubbed out test suite for element %s', r.name);
  console.log('');
  console.log('Next Steps:');
  console.log('');
  console.log('  Run \'churros props %s:my.config.key my.value\' for each required config needed to provision\n', r.name);
  console.log('  Update each resource\'s schema file in the elements/%s/assets directory to include all of the fields for that resource\n', r.name);
  console.log('  Start building out tests for each resource\'s .js file, leveraging the common \'tester.test\' functions as much as possible\n');
  console.log('  Run \'churros test elements/%s\' to run your tests!', r.name);
  console.log('');
  console.log('For more information, see the CONTRIBUTING.md here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md');
  console.log('');
};

const showPlatformAdvice = (r) => {
  console.log('Successfully stubbed out test suite for platform resource %s', r.name);
  console.log('');
  console.log('Next Steps:');
  console.log('');
  console.log('  Update the %s/assets/%s.schema.json schema file to include all of the fields for a(n) %s', r.name, r.name, r.name);
  console.log('  Start building out the %s/%s.js file with tests, leveraging the common \'tester.test\' functions as much as possible\n', r.name, r.name);
  console.log('  Run \'churros test %s\' to run your tests!', r.name);
  console.log('');
  console.log('For more information, see the CONTRIBUTING.md here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md');
  console.log('');
};

const add = (type, options) => {
  if (type === 'element') {
    buildElementQuestions(type)
      .then(r => askQuestions(r))
      .then(r => askResourceQuestions(r))
      .then(r => stubElementFiles(r))
      .then(r => showElementAdvice(r))
      .catch(r => terminate(r));
  } else if (type === 'platform') {
    buildPlatformQuestions(type)
      .then(r => askQuestions(r))
      .then(r => stubPlatformFiles(r))
      .then(r => showPlatformAdvice(r))
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
