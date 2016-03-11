'use strict';

const suite = require('core/suite');
const payload = require('./assets/activitiesCalls');

suite.forElement('crm', 'activitiesCalls', payload, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
