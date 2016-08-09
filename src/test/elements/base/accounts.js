'use strict';

const tools = require('core/tools');
const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('crm', 'accounts', (test) => {
  test.should.return200OnGet();
});
