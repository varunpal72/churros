'use strict';

const suite = require('core/suite');
const payload = require('./assets/sampleBulkCustomObject_c');

suite.forElement('marketing', 'sampleBulkCustomObject_c', { payload: payload }, (test) => {
  test.should.supportCrud();
});
