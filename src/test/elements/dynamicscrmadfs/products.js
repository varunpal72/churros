'use strict';

const suite = require('core/suite');
const payload = require('./assets/products');

suite.forElement('crm', 'products', { payload: payload }, (test) => {
 test.should.supportSr();
 test.should.supportPagination();
});
