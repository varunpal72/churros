'use strict';

const suite = require('core/suite');

suite.forElement('crm', 'custom-record-types', (test) => {
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.supportPagination();
});
