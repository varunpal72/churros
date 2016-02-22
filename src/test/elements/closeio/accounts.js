'use strict';

const suite = require('core/suite');
const account = require('./assets/account');

suite.forElement('crm', 'accounts', account, (test) => {
  test.should.supportCruds();
});
