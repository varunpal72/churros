'use strict';

const suite = require('core/suite');
const payload = require('./assets/prospects');

suite.forElement('crm', 'prospects', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.supportPagination();
  test.should.supportCeqlSearch('id');
});
