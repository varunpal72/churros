'use strict';

const suite = require('core/suite');
const payload = require('./assets/time-activities');

suite.forElement('finance', 'time-activities', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
});
