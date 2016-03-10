'use strict';

const suite = require('core/suite');
const payload = require('./assets/activitiesEvents');

suite.forElement('crm', 'activitiesEvents', payload, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
