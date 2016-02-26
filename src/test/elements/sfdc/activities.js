'use strict';

const suite = require('core/suite');
const payload = require('./assets/activities');
const schema = require('./assets/activities.schema');

suite.forElement('crm', 'activities', payload, schema, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
