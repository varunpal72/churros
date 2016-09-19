'use strict';

const suite = require('core/suite');
const payload = require('./assets/campaigns');

suite.forElement('crm', 'campaigns', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportCeqlSearch('id');
  test.should.supportPagination();
});
