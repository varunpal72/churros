'use strict';

const suite = require('core/suite');
const payload = require('./assets/products');

suite.forElement('crm', 'products', { payload: payload }, (test) => {
  test.should.supportCrus();
  test.withOptions({ qs: { where: 'name=\'PlateOfChurrosProduct\'' } }).should.return200OnGet();
  test.should.supportPagination();
});
