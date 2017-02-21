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
const suite = require('core/suite');

const createAll = (urlTemplate, list) => {
  return Object.keys(list).reduce((p, key) =>
    p.then(() => cloud.post(util.format(urlTemplate, key), list[key])),
    Promise.resolve(true)); // initial
};

const terminate = (error) => {
  logger.error('Failed to initialize element: %s', error);
  process.exit(1);
};

let instanceId;
var instanceIds = []
before(() => {
  const element = argv.element;
  const config = provisioner.genConfig(props.all(element));
  logger.info('Running tests for element: %s', element);
  if(props.getOptionalForKey(argv.element, 'skip') === true) {
    logger.info('Skip provisioning and all tests for %s', element);
    return {};
  }

  // checkCreds("Doesn't provision with bad API key", ['api.key'], config, element)
  // checkCreds("Doesn't provision with bad API secret", ['api.secret'], config, element)
  // checkCreds("Doesn't provision with bad Username and password", ['user', 'password'], config, element)

  return provisioner.create(element, null, null, config)
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
      return instanceId ?
        provisioner.delete(instanceId)
        .then(() => terminate(r))
        .catch(() => terminate(r)) :
        terminate(r);
    });
});

after(done => {
  instanceIds.forEach(id => provisioner.delete(id))
  instanceId ?
    provisioner.delete(instanceId)
    .then(() => done())
    .catch(r => logger.error('Failed to delete element instance: %s', r)) :
    done();
});

function checkCreds (title, arrCreds, config, element) {
  it(title, () => {
    var badConfig = provisioner.changeCreds(config, arrCreds)
    var configStr = JSON.stringify(config)
    if (JSON.stringify(badConfig) != configStr) {
      return provisioner.create(element, null, null, badConfig, false)
      .then(r => {
          if (r.body) {
            if(r.body.id) {
              instanceIds.push(r.body.id)
              return r.body.id
            } else {
              return null
            }
          } else {
              return null
          }
        })
        .catch(e => null)
        .then(res => {
          expect(res).to.not.exist
        })
    } else {
      return;
    }
  })
}
