'use strict';

const tester = require('core/tester');
const schema = require('./assets/folder.schema.json');

tester.for('documents', 'folders', schema, (api) => {
  it('should allow listing folder contents', () => {
    return tester.get(api + '/contents', schema, { qs: { path: '/' } });
  });
});
