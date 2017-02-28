'use strict';

const cloud = require('core/cloud');
const expect = require('chakram').expect;
const util = require('util');
const provisioner = require('core/provisioner');
const tools = require('core/tools');
const argv = require('optimist').argv;
const fs = require('fs');
const logger = require('winston');
const props = require('core/props');

const createAll = (urlTemplate, list) => {
  return Object.keys(list)
    .reduce((p, key) => p.then(() => cloud.post(util.format(urlTemplate, key), list[key])), Promise.resolve(true)); // initial
};

const terminate = error => {
  logger.error('Failed to initialize element: %s', error);
  process.exit(1);
};

const element = argv.element;
let instanceId;

before(() => {
  logger.info('Running tests for element: %s', element);
  if (props.getOptionalForKey(argv.element, 'skip') === true) {
    logger.info('Skip provisioning and all tests for %s', element);
    return {};
  }

  return provisioner
    .create(element)
    .then(r => {
      expect(r).to.have.statusCode(200);
      instanceId = r.body.id;
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

        return createAll(url, objectDefinitions);
      }
    })
    .then(r => {
      // transformations file exists? create the transformations on the instance
      const transformationsFile = `${__dirname}/${element}/assets/transformations`;
      if (fs.existsSync(transformationsFile + '.json')) {
        logger.debug('Setting up transformations');
        const url = `/instances/${instanceId}/transformations/%s`;
        return createAll(url, require(transformationsFile));
      }
    })
    .catch(r => {
      return instanceId ? provisioner.delete(instanceId).then(() => terminate(r)).catch(() => terminate(r)) : terminate(r);
    });
});

it('should not allow provisioning with bad credentials', () => {
  let badInstanceId;
  let res;
  const config = props.all(element);
  const type = props.getOptionalForKey(element, 'provisioning');
  const passThrough = (r) => r;

  const badConfig = Object.keys(config).reduce((accum, configKey) => {
    accum[configKey] = 'IAmBad';
    return accum;
  }, {});

  const elementInstance = {
    name: tools.random(),
    element: { key: element },
    configuration: badConfig
  };
  if (type === 'oauth2' || type === 'oauth1') {
    elementInstance.providerData = {code: 'IAmBad'};
  }

  return cloud.post(`/instances`, elementInstance, passThrough)
    .then(r => {
      res = r;
      badInstanceId = r.body.id;
    })
    .then(r => badInstanceId ? cloud.delete(`/instances/${badInstanceId}`) : null)
    .catch(r => badInstanceId ? cloud.delete(`/instances/${badInstanceId}`) : null)
    .then(r => expect(res.response.statusCode).to.not.equal(200));
});
after(done => {
  instanceId ? provisioner
        .delete(instanceId)
        .then(() => done())
        .catch(r => logger.error('Failed to delete element instance: %s', r))
    : done();
});
