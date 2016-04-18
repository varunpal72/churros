'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

const payload = () => ({
  "id": tools.random(),
  "name": tools.random(),
  "invoice_name": tools.random(),
  "price": tools.randomInt()
});

suite.forElement('payment', 'plans', { payload: payload({})}, (test) => {
  test.should.supportCruds();
});
