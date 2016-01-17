'use strict';

const ei = require('core/element-instances')
const setup = require('../setup');
const argv = require('optimist').demand('user').argv

var instanceId = -1;

before(done => {
  const element = argv.element;
  ei.create(element)
    .then(r => {
      instanceId = r.body.id;
      done();
    })
    .catch(r => {
      console.log('Well shucks...failed to finish setup...\n  Is %s up and running?\n  Do you have the write username and password?', url);
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
