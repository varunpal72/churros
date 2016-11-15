'use strict';

const suite = require('core/suite');
const payload = require('./assets/activitiesCalls');

suite.forElement('crm', 'activitiesCalls', { payload: payload, skip: true }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
