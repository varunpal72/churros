'use strict';

const suite = require('core/suite');
const payload = require('./assets/activitiesEmails');

suite.forElement('crm', 'activitiesEmails', payload, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
