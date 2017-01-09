'use strict';

const suite = require('core/suite');
const payload = require('./assets/customers');
suite.forElement('finance', 'customers', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'whenmodified>\'08/13/2016 05:26:37\'' }, skip: true }).should.return200OnGet();
});