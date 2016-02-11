'use strict';

const tester = require('core/tester');
const schema = require('./assets/folder.schema.json');

tester.forElement('documents', 'folders', null, schema, (test) => {
  it('should allow listing folder contents', () => {
    return cloud.get(test.api + '/contents', schema, { qs: { path: '/' } });
  });
});
