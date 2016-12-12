'use strict';

const suite = require('core/suite');

suite.forElement('marketing', 'meetings', null, (test) => {
  test.should.supportSr();
  test.withOptions({ qs: { page: 1, pageSize: 5}}).should.return200OnGet();
});
