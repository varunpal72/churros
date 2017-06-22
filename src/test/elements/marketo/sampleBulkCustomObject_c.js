'use strict';

const suite = require('core/suite');
const payload = require('core/tools').requirePayload(`${__dirname}/assets/sampleBulkCustomObject_c.json`);

suite.forElement('marketing', 'sampleBulkCustomObject_c', { payload: payload }, (test) => {
  test.should.supportCrud();
});
