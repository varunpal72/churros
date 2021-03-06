'use strict';

const suite = require('core/suite');
const payload = require('./assets/tasks');

suite.forElement('crm', 'tasks', { payload: payload, skip: true}, (test) => {
  test.should.supportCrus();
  test.withOptions({ qs: { where: 'title=\'ChurrosTestTask\'' } }).should.return200OnGet();
  test.should.supportPagination();
  test.should.supportNextPagePagination(1);
});
