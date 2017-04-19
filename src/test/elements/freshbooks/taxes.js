'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

const payload = () => ({
  "name": tools.randomStr('abcdefghijklmnopqrstuvwxyz1234567890', 5)+ " tax",
  "rate": "3",
  "number": "1222222",
  "compound": 0
});

suite.forElement('finance', 'taxes', { payload: payload() }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'compound = 0' } }).should.return200OnGet();
});
