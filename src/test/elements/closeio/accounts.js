'use strict';

const suite = require('core/suite');
const schema = require('./assets/account.schema');
const account = require('./assets/account');

suite.forElement('crm', 'accounts', account, schema, (test) => {
  test.should.supportCruds();
});
