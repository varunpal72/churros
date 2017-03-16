'use strict';

const suite = require('core/suite');
const payload = require('./assets/payments');

suite.forElement('payment', 'payments', { payload: payload }, (test) => {
  test.withOptions({ skip: true }).should.supportCrs();
  // Other tests missing as they hinge on authorizating the payment via selenium 
  test.should.supportPagination();
  test.withName('should support Ceql search').withOptions({ qs: { where: `start_time='2016-03-06T11:00:00Z'` } }).should.return200OnGet();
});
