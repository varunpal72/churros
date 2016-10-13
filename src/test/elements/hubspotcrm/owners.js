'use strict';

const suite = require('core/suite');
const payload = require('./assets/owners');

suite.forElement('crm', 'owners', { payload: payload }, (test) => {
  test
  .withOptions({ skip: true })
  .should.supportCrus();

  test.should.supportPagination();
});
