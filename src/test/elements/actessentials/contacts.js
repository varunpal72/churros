'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');


suite.forElement('marketing', 'contacts', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  // test for functional where to OData field
  test.withOptions({qs: {where: 'lastName=\'Smith\''} }).should.return200OnGet();

});
