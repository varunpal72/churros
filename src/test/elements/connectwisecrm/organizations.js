'use strict';

const suite = require('core/suite');
const payload = require('./assets/organizations');
const tools = require('core/tools');

const createOrganization = (payload) => {
  payload.companyIdentifier = payload.companyIdentifier + tools.randomStr('abcdefghijklmnopqrstuvwxyz0123456789', 10);
  return payload;
};

suite.forElement('crm', 'organizations', { payload: createOrganization(payload) }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { where: 'companyName=\'Churros Company\'' } }).should.return200OnGet();
  test.should.supportPagination('id');
});
