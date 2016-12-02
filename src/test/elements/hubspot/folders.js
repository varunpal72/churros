'use strict';

const suite = require('core/suite');
const payload = require('./assets/folders');

suite.forElement('marketing', 'folders', { payload: payload }, (test) => {
  test.should.supportCrud();
  test.should.supportPagination();
});
