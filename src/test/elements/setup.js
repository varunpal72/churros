'use strict';

const chakram = require('chakram');
const expect = chakram.expect;
const util = require('util');
const ei = require('core/element-instances');
const argv = require('optimist').demand('element').argv;
const fs = require('fs');

var instanceId = -1;

before(done => {
  const element = argv.element;
  ei.create(element)
    .then(r => {
      expect(r).to.have.statusCode(200);
      instanceId = r.body.id;
      const file = util.format('%s/%s/assets/transformations', __dirname, element);
      if (fs.existsSync(file + '.json')) {
        const transformUrl = util.format('/instances/%s/transformations/contacts', instanceId);
        const payload = require(file)['contacts'];
        console.log('posting to %s with %s', transformUrl, JSON.stringify(payload));
        return chakram.post(transformUrl, payload);
      }
      return r;
    })
    .then(r => {
      expect(r).to.have.statusCode(200);
      done();
    })
    .catch(r => {
      console.log('hi');
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
