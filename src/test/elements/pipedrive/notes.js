'use strict';

const suite = require('core/suite');

suite.forElement('crm', 'notes', null, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'content = \'Note content updated\'' } }).should.return200OnGet();
});