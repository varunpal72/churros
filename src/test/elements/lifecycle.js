'use strict';

const cloud = require('core/cloud');
const expect = require('chakram').expect;
const util = require('util');
const provisioner = require('core/provisioner');
const tools = require('core/tools');
const defaults = require('core/defaults');
const cleaner = require('core/cleaner');
const argv = require('optimist').argv;
const fs = require('fs');
const logger = require('winston');
const props = require('core/props');
const beforeTests = require(`${__dirname}/assets/basics.js`)

const createAll = (urlTemplate, list) => {
  return Object.keys(list).sort()
    .reduce((p, key) => p.then(() => {
      return cloud.post(util.format(urlTemplate, key), list[key])
      .catch(err => cloud.post(util.format(urlTemplate, key), list[key]));
    }), Promise.resolve(true)); // initial
};

const terminate = error => {
  logger.error('Failed to initialize element: %s', error);
  process.exit(1);
};

let element = argv.element;
let instanceId, hub;
let deleteInstance = !argv.save; //we don't always want to delete. Defaults to true
// Setting which element we are currently running on
props.set('element', element);
before(() => {
  tools.resetCleanup();
  logger.info('Using url: %s', props.get('url'));
  logger.info('Using user: %s', props.get('user'));
  if (props.getOptionalForKey(element, 'username')) logger.info('Using oauth username: %s', props.getOptionalForKey(element, 'username'));
  if (props.getOptionalForKey(element, 'oauth.api.key')) logger.info('Using api key: %s', props.getOptionalForKey(element, 'oauth.api.key'));
  logger.info('Running tests for element: %s', element);
  if (props.getOptionalForKey(argv.element, 'skip') === true) {
    logger.info('Skip provisioning and all tests for %s', element);
    return {};
  }
  return tools.runFile(element, `${__dirname}/${element}/assets/scripts.js`, 'before')
  .then(() => !argv.save ? cleaner.cleanElementsBefore() : null)
  .then(() => {
    let getInstance;
    if (argv.instance) {
      getInstance = cloud.get(`/instances/${argv.instance}`)
      .then(r => {
        defaults.token(r.body.token);
        expect(r.body.element.key).to.equal(tools.getBaseElement(element));
        deleteInstance = false;
        return r;
      });
    } else if (argv.backup === 'only backup') {
      deleteInstance = false;
      getInstance = provisioner.getBackup(element);
    } else {
      getInstance = provisioner.create(element)
      .catch(e => {
        if (argv.backup === 'use backup') { //if default flag
          deleteInstance = false;
          return provisioner.getBackup(element);
        } else {
          throw Error(e);
        }
      });
    }

    return getInstance
      .then(r => {
        expect(r).to.have.statusCode(200);
        props.setForKey(element, 'elementId', r.body.element.id);
        logger.info('Provisioned with instance id of ' + r.body.id);
        instanceId = r.body.id;
        hub = r.body.element.hub;
        element = tools.getBaseElement(element);

        // object definitions file exists? create the object definitions on the instance
        const objectDefinitionsFile = `${__dirname}/assets/object.definitions`;
        if (fs.existsSync(objectDefinitionsFile + '.json')) {
          logger.debug('Setting up object definitions');
          const url = `/instances/${instanceId}/objects/%s/definitions`;

          // only create object definitions for the resources that are being transformed for this element.  If there
          // aren't any transformations, no need to create any object definitions.
          const transformationsFile = `${__dirname}/${element}/assets/transformations`;
          if (!fs.existsSync(transformationsFile + '.json')) {
            logger.debug(`No transformations found for ${element} so not going to create object definitions`);
            return null;
          }

          const transformations = require(transformationsFile);
          const allObjectDefinitions = require(objectDefinitionsFile);
          const objectDefinitions = Object.keys(allObjectDefinitions)
            .reduce((accum, objectDefinitionName) => {
              if (transformations[objectDefinitionName]) {
                accum[objectDefinitionName] = allObjectDefinitions[objectDefinitionName];
              }
              return accum;
            }, {});

          return createAll(url, objectDefinitions)
          .catch(() => {});
        }
      })
      .then(r => {
        // transformations file exists? create the transformations on the instance
        const transformationsFile = `${__dirname}/${element}/assets/transformations`;
        if (fs.existsSync(transformationsFile + '.json')) {
          logger.debug('Setting up transformations');
          const url = `/instances/${instanceId}/transformations/%s`;
          return createAll(url, require(transformationsFile))
          .catch(() => {});
        }
      })
      .catch(r => {
        return instanceId && deleteInstance ? provisioner.delete(instanceId).then(() => terminate(r)).catch(() => terminate(r)) : terminate(r);
      });
    });
});

describe('Basics', () => {
  beforeTests(element, instanceId, hub);
});


after(done => {
  tools.resetCleanup();
  instanceId && deleteInstance ? provisioner
        .delete(instanceId)
        .then(() => done())
        .catch(r => logger.error('Failed to delete element instance: %s', r))
    : done();
});
