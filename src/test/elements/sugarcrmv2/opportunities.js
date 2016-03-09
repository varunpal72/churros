'use strict';

const suite = require('core/suite');
const payload = require('./assets/opportunities');

suite.forElement('crm', 'opportunities', payload, (test) => {
  test.should.supportCruds();
});
