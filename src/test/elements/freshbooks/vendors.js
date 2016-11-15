'use strict';

const suite = require('core/suite');
const payload = require('./assets/vendors');

suite.forElement('finance', 'vendors', { payload: payload, skip: true }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
