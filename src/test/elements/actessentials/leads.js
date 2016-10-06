'use strict';

const suite = require('core/suite');
const payload = require('./assets/leads');

suite.forElement('marketing', 'leads', { payload: payload }, (test) => {
  // checkout functions available under test.should which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite
  test.should.supportCruds();
  test.should.supportPagination();
  test.withOptions({ qs:{ where:'title=\'Churro opportunity\''} }).should.return200OnGet();

});
