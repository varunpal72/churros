'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

const payload = () => ({
  "amount": tools.randomInt(),
  "interval": "month",
  "name": tools.random(),
  "currency": "usd",
  "id": tools.random()
});

suite.forElement('payment', 'plans', { payload: payload ()}, (test) => {
  test.should.supportCruds();
});
