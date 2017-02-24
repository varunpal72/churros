'use strict';

const cloud = require('core/cloud');
const chakram = require('chakram');
const expect = chakram.expect;
const util = require('util');
const provisioner = require('core/provisioner');
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
        return createAll(url, require(objectDefinitionsFile));
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

const makeInstance = (element, config) => {
  return {
    name: tools.random(),
    element: { key: element },
    configuration: config
  };
};

let badInstanceIds = [];
it('should not allow provisioning with bad credentials', () => {
  let tests = [];
  const config = props.all(element);
  const type = props.getOptionalForKey(element, 'provisioning');
  const passThrough = (r) => r;

  let badConfig = Object.keys(config).reduce((accum, configKey) => {
    accum[configKey] = 'IAmBad';
    return accum;
  }, {});

  let elementInstance = makeInstance(element, badConfig);
  tests.push(cloud.post(`/instances`, elementInstance, passThrough)
    .then(r => {
      badInstanceIds.push(r.body.id);
      expect(r.body.id, 'Provisioned with bad credentials with an id of ' + r.body.id).to.not.exist;
    }));

  if (type === 'oauth2' || type === 'oauth1') {
    badConfig = Object.keys(config).reduce((accum, configKey) => {
      accum[configKey] = configKey.toLowerCase().includes('key') ? 'IAmBad' : config[configKey];
      return accum;
    }, {});
    elementInstance = makeInstance(element, badConfig);
    tests.push(cloud.post(`/instances`, elementInstance, passThrough)
      .then(r => {
        badInstanceIds.push(r.body.id);
        expect(r.body.id, 'Provisioned with bad credentials with an id of ' + r.body.id).to.not.exist;
      }));
  }

  return chakram.waitFor(tests);
});
after(done => {
  badInstanceIds.forEach(id => cloud.delete(id));
  instanceId ? provisioner
        .delete(instanceId)
        .then(() => done())
        .catch(r => logger.error('Failed to delete element instance: %s', r))
    : done();
});
