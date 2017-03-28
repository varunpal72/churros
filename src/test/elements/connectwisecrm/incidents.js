'use strict';

const suite = require('core/suite');
const payload = require('./assets/incidents');

suite.forElement('crm', 'incidents', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { where: 'summary=\'Sample API Posted Issue From Churros\'' } }).should.return200OnGet();
  test.should.supportPagination();
});
