'use strict';

const chakram = require('chakram');
const expect = chakram.expect;
const util = require('util');
const provisioner = require('core/provisioner');
const argv = require('optimist').demand('element').argv;
const fs = require('fs');
const logger = require('winston');
let defaults = require('core/defaults');

const createAll = (urlTemplate, list) => {
  let promises = [];
  Object.keys(list).forEach(key => {
    const payload = list[key];
    const url = util.format(urlTemplate, key);
    promises.push(chakram.post(url, payload));
  });
  return chakram.all(promises);
};

const terminate = (error) => {
  logger.error('Failed to initialize element: %s', error);
  process.exit(1);
};

let instanceId;
before(done => {
  const element = argv.element;
  provisioner.create(element)
    .then(r => {
      expect(r).to.have.statusCode(200);
      instanceId = r.body.id;
      defaults.token(r.body.token);
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
    .then(r => done())
    .catch(r => {
      if (instanceId) {
        provisioner.delete(instanceId)
          .then(() => terminate(r))
          .catch(() => terminate(r));
      }
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
