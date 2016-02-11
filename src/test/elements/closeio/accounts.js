'use strict';

const tester = require('core/tester');
const schema = require('./assets/account.schema');
const account = require('./assets/account');

tester.forElement('crm', 'accounts', account, schema, (test) => {
  test.should.supportCruds();
});
