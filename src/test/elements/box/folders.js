'use strict';

const suite = require('core/suite');
const schema = require('./assets/folder.schema.json');

suite.forElement('documents', 'folders', null, schema, (test) => {
  const contentsApi = test.api + '/contents';
  test.withOptions({ qs: { path: '/' } }).withApi(contentsApi).should.return200OnGet();
});
