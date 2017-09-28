'use strict';

const suite = require('core/suite');
const payload = require('./assets/work-orders');

suite.forElement('fsa', 'work-orders', { payload: payload }, (test) => {

  test.should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
});
