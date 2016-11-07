'use strict';

const suite = require('core/suite');
const payload = require('./assets/activitiesEvents');

suite.forElement('crm', 'activitiesEvents', { payload: payload, skip: true }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
