'use strict';

const suite = require('core/suite');
const payload = require('./assets/accounts');
const schema = require('./assets/accounts.schema');

suite.forElement('crm', 'accounts', payload, schema, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
