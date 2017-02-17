'use strict';

const suite = require('core/suite');

suite.forElement('helpdesk', 'agents', null, (test) => {
  test.should.supportSr();
  test.withName(`should support searching ${test.api} by email`).withOptions({ qs: { where: 'email=\'freshdesk@cloud-elements.com\'' } }).should.return200OnGet();
  test.should.supportPagination();
});