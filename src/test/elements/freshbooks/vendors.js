'use strict';

const suite = require('core/suite');
const payload = require('./assets/vendors');

suite.forElement('finance', 'vendors', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
