'use strict';

const suite = require('core/suite');
const payload = require('./assets/jobs');

suite.forElement('fsa', 'jobs', { payload: payload }, (test) => {
  test.should.supportCrud();
  test.withOptions({
    qs: {
      page: 1,
      pageSize: 5,
      where: 'startDate=\'2016-09-01\' and endDate=\'2016-09-15\''
    }
  }).should.return200OnGet();
});
