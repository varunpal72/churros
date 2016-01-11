'use strict';
const box = require('core/provision/box');
const ei = require('core/util/element-instances')

before((done) => {
  box.create().then((r) => {
    instanceId = r.body.id;
    done();
  });
});

after((done) => {
  ei.delete(instanceId).then(() => {
    done();
  });
});
