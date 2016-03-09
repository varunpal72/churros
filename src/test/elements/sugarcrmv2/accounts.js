'use strict';

const suite = require('core/suite');
const payload = require('./assets/accounts');

suite.forElement('crm', 'accounts', payload, (test) => {
  test.should.supportCruds();
});
