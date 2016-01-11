'use strict';
const box = require('core/provision/box');
const ei = require('core/util/element-instances')

describe('box apis', () => {
  var instanceId = 0;

  before((done) => {
    box.create().then((r) => {
      instanceId = r.body.id;
      done();
    });
  });

  require('./folders');
  require('./files');

  after((done) => {
    ei.delete(instanceId).then(() => {
      done();
    });
  });
});
