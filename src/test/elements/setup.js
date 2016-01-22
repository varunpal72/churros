'use strict';

const chakram = require('chakram');
const expect = chakram.expect;
const util = require('util');
const ei = require('core/element-instances');
const argv = require('optimist').demand('element').argv;
const fs = require('fs');

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
  console.log('Well shucks...failed to finish setup...\n  Is your URL up and running?\n  Do you have the right username and password? %s', error);
  process.exit(1);
};

var instanceId;
before(done => {
  const element = argv.element;
  console.log('Attempting to provision %s', element);
  ei.create(element)
    .then(r => {
      expect(r).to.have.statusCode(200);
      instanceId = r.body.id;
      // object definitions file exists? create the object definitions on the instance
      const objectDefinitionsFile = util.format('%s/assets/object.definitions', __dirname);
      if (fs.existsSync(objectDefinitionsFile + '.json')) {
        console.log('Setting up object definitions');
        const url = util.format('/instances/%s/objects/%s/definitions', instanceId);
        return createAll(url, require(objectDefinitionsFile));
      }
    })
    .then(r => {
      // transformations file exists? create the transformations on the instance
      const transformationsFile = util.format('%s/%s/assets/transformations', __dirname, element);
      if (fs.existsSync(transformationsFile + '.json')) {
        console.log('Setting up transformations');
        const url = util.format('/instances/%s/transformations/%s', instanceId);
        return createAll(url, require(transformationsFile));
      }
    })
    .then(r => done())
    .catch(r => {
      if (instanceId) {
        ei.delete(instanceId)
          .then(() => terminate(r))
          .catch(() => terminate(r));
      }
      terminate(r);
    });
});

after(done => {
  instanceId ?
    ei.delete(instanceId)
    .then(() => done())
    .catch(r => console.log('Failed to delete element instance')) :
    done();
});
