'use strict';

const suite = require('core/suite');
const payload = require('./assets/todos');

suite.forElement('crm', 'todos', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  test.withOptions({qs:{where: 'subject=\'churros\''}}).should.return200OnGet();
});
