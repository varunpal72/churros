'use strict';

const suite = require('core/suite');
const payload = require('./assets/incidents');

suite.forElement('crm', 'incidents', payload, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
