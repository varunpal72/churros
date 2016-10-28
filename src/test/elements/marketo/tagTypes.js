'use strict';

const suite = require('core/suite');

suite.forElement('marketing', 'tagTypes', (test) => {
  let tagType = "Sample TagType";
  test.should.supportPagination();
  test.should.supportS();
  test.withApi(test.api + '/${tagType}').should.return200OnGet();
  test.withApi(test.api + '/${tagType}').should.supportPagination;
});
