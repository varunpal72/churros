'use strict';

const suite = require('core/suite');
const payload = require('./assets/sampletable');
const cloud = require('core/cloud');
suite.forElement('db', 'SampleTable', { payload: payload }, (test) => {
  it('should allow POST and READ for sample table', () => {
    return cloud.post(test.api, payload)
      .then(r => cloud.get(test.api));
  });
});
