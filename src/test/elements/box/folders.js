'use strict';

const tester = require('core/tester');
const schema = require('./assets/folder.schema.json');

tester.forElement('documents', 'folders', null, schema, (test) => {
  const contentsApi = test.api + '/contents';
  test.withOptions({ qs: { path: '/' } }).withApi(contentsApi).should.return200OnGet();
});
