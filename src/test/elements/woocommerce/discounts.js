'use strict';

const suite = require('core/suite');
const payload = require('./assets/discounts');

suite.forElement('ecommerce', 'discounts', { payload: payload }, (test) => {
  test.withOptions({ churros: { updatePayload: { maximum_amount: "500.00" } } }).should.supportCruds();
  test.should.supportPagination();
});
