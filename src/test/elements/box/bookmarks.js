'use strict';

const cloud = require('core/cloud');
const suite = require('core/suite');

suite.forElement('documents', 'folders/contents', (test) => {
  test.withOptions({qs: { path: "/TestFolderDoNoDelete"}}).should.return200OnGet();
});
