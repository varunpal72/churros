'use strict';

const suite = require('core/suite');
const payload = require('./assets/leads');

suite.forElement('crm', 'leads', payload, (test) => {
  test.should.supportCruds();
});
