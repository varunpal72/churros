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

const element = argv.element;
var instanceId = -1;
before(done => {
  console.log('Attempting to provision a(n) %s instance', element);
  ei.create(element)
    .then(r => {
      expect(r).to.have.statusCode(200);
      console.log('Setting up object definitions');
      instanceId = r.body.id;
      const objectDefinitionsFile = util.format('%s/assets/object.definitions', __dirname);
      if (fs.existsSync(objectDefinitionsFile + '.json')) {
        const url = util.format('/instances/%s/objects/%s/definitions', instanceId);
        return createAll(url, require(objectDefinitionsFile));
      }
    })
    .then(r => {
      console.log('Setting up transformations');
      const transformationsFile = util.format('%s/%s/assets/transformations', __dirname, element);
      if (fs.existsSync(transformationsFile + '.json')) {
        const url = util.format('/instances/%s/transformations/%s', instanceId);
        return createAll(url, require(transformationsFile));
      }
    })
    .then(r => done())
    .catch(r => {
      console.log('Well shucks...failed to finish setup...\n  Is your URL up and running?\n  Do you have the right username and password? %s', r);
      process.exit(1);
    });
});

after(done => {
  if (instanceId < 0) {
    console.log('No element instance found to delete');
    done();
  }

  ei.delete(instanceId)
    .then(() => done())
    .catch(r => console.log('Failed to delete element instance'));
});
