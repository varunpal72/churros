'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('documents', 'folders', null, (test) => {
  it('should allow GET for hubs/documents/folders  by path', () => {
    return cloud.withOptions({ qs: { path: `/` } }).get(`${test.api}/contents`);
  });
});
