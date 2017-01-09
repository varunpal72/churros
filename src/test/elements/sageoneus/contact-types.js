'use strict';

const suite = require('core/suite');

suite.forElement('sageaccounting', 'contact-types', {skip: true}, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
});
