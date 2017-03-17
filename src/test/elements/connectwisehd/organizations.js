'use strict';

const suite = require('core/suite');
const payload = require('./assets/organizations');
const tools = require('core/tools');


const createOrganization = (payload) => {
  payload.companyIdentifier = tools.randomStr('abcdefghijklmnopqrstuvwxyz1234567890', 20);
  return payload;
};


suite.forElement('helpdesk', 'organizations', { payload: createOrganization(payload), skip:true }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { where: 'companyName=\'Churros HD Company\'' } }).should.return200OnGet();
  test.should.supportPagination();
});
