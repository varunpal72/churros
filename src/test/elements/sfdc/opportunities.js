'use strict';

const suite = require('core/suite');
const payload = require('./assets/opportunities');
const schema = require('./assets/opportunities.schema');

suite.forElement('crm', 'opportunities', payload, schema, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
