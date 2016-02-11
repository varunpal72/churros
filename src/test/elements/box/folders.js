'use strict';

const tester = require('core/tester');
const schema = require('./assets/folder.schema.json');

tester.forElement('documents', 'folders', null, schema, (suite) => {
  it('should allow listing folder contents', () => {
    return tester.get(suite.api + '/contents', schema, { qs: { path: '/' } });
  });
});
