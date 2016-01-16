'use strict';

const box = require('core/provision/box');
const ei = require('core/util/element-instances')

var instanceId = 0;

before((done) => {
  box.create()
    .then(r => {
      instanceId = r.body.id;
      done();
    })
    .catch(r => {
      console.log('Well shucks...failed to finish setup...\n  Is %s up and running?\n  Do you have the write username and password?', url);
      process.exit(1);
    });
});

after((done) => {
  ei.delete(instanceId)
    .then(() => {
      done();
    })
    .catch(r => {
      console.log('Failed to delete element instance');
    });
});
