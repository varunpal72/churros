'use strict';

const suite = require('core/suite');
const payload = require('./assets/organizations');
const tools = require('core/tools');

const createOrganization = (payload) => {
  payload.companyIdentifier = payload.companyIdentifier + tools.randomInt().toString();
  return payload;
};

suite.forElement('crm', 'organizations', { payload: createOrganization(payload) }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { where: 'companyName=\'Churros Company\'' } }).should.return200OnGet();
  test.should.supportPagination();
});
