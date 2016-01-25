'use strict';

const tester = require('core/tester');
const folderSchema = require('./assets/folder.schema.json');

tester.for('documents', 'folders', (api) => {
  it('should allow listing folder contents', () => {
    var uri = api + '/contents?path=/';
    return tester.get(uri, folderSchema);
  });
});
