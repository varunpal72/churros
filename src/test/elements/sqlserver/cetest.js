'use strict';

const suite = require('core/suite');
const payload = require('./assets/cetest');
const cloud = require('core/cloud');
suite.forElement('db', 'CE_TEST', { payload: payload }, (test) => {
  it('should allow CS for cetest', () => {
    return cloud.post(test.api, payload)
      .then(r => cloud.get(test.api));
  });
});