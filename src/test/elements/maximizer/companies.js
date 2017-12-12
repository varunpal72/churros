'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const companyPayload = tools.requirePayload(`${__dirname}/assets/company.json`);

suite.forElement('crm', 'companies', { payload: companyPayload }, (test) => {
  test.should.supportPagination("id");
  test.should.supportCruds();
});
