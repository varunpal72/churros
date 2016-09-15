'use strict';

const cloud = require('core/cloud');
const expect = require('chakram').expect;
const util = require('util');
const provisioner = require('core/provisioner');
const argv = require('optimist').argv;
const fs = require('fs');
const logger = require('winston');

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
before(() => {
  const element = argv.element;
  return provisioner.create(element)
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
  instanceId ?
    provisioner.delete(instanceId)
    .then(() => done())
    .catch(r => logger.error('Failed to delete element instance: %s', r)) :
    done();
});
