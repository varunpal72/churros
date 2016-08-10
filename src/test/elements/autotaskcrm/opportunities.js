'use strict';

const suite = require('core/suite');
const payload = require('./assets/opportunities');

suite.forElement('crm', 'opportunities', { payload: payload }, (test) => {
  // checkout functions available under test.should which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite

  test.should.supportCrus();
  test.withOptions({ qs: { where: 'title=\'ChurrosTestOpportunity\'' } }).should.return200OnGet();
  test.should.supportPagination();
});
