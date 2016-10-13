'use strict';

const suite = require('core/suite');
const payload = require('./assets/interactions');

suite.forElement('marketing', 'interactions', { payload: payload }, (test) => {
  test.should.supportCrds();
  test.should.supportPagination();
  test.withOptions({qs:{where:'subject=\'Churros\''}}).should.return200OnGet();
  // test update through Put only
  
});
