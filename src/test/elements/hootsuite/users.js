'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('social', 'users', (test) => {
  test.should.supportSr()
  test.should.supportPagination();
});
