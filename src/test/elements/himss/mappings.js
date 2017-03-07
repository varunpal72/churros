'use strict';

const suite = require('core/suite');
const payload = require('./assets/mappings');
const cloud = require('core/cloud');

suite.forElement('general', 'mappings', { payload: payload }, (test) => {
  it.skip('should allow POST and DELETE /mappings', () => {
    return cloud.post(test.api, payload)
      .then(r => cloud.delete(test.api));
  });
});
