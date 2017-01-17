'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/payment-methods');
const build = (overrides) => Object.assign({}, payload, overrides);
const paymentMethods = build({ name: tools.random() });
suite.forElement('finance', 'payment-methods', { payload: paymentMethods }, (test) => {
  test.should.supportCrs();
  test.withOptions({ qs: { page: 1, pageSize: 1 } }).should.return200OnGet();
});
