'use strict';

const suite = require('core/suite');
const payload = require('./assets/blocks');

suite.forElement('social', 'blocks', { payload: payload }, (test) => {
  test.should.supportCd();
  test.withApi(test.api + '-id').should.return200OnGet();
  test.withApi(test.api + '-id').should.supportPagination();
  test.withApi(test.api + '-list').should.return200OnGet();
  test.withApi(test.api + '-list').should.supportPagination();
});
