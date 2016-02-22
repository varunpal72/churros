'use strict';

const suite = require('core/suite');

suite.forElement('documents', 'folders', null, (test) => {
  const contentsApi = test.api + '/contents';
  test.withOptions({ qs: { path: '/' } }).withApi(contentsApi).should.return200OnGet();
});
