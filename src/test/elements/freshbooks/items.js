'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

const payload = () => ({
  "name": "Churros " + tools.random(),
  "description": "xtra tasty",
  "unit_cost": "11.99",
  "quantity": "1",
  "inventory": "10"
});

suite.forElement('finance', 'items', { payload: payload(), skip: true }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
