'use strict';

const suite = require('core/suite');

suite.forElement('finance', 'sales-tax-items', (test) => {
    test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.supportPagination();
    test.withOptions({ qs: { where: 'lastModifiedDate >= \'2016-08-05T09:35:38Z\'' } }).should.return200OnGet();
});
