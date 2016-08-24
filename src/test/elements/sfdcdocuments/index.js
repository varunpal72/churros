'use strict';

const documents = require('../assets/documents');
const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('documents', 'folders', (test) => {
  it('should allow GET /folders/contents and GET /folders/:id/contents', () => {
    return cloud.withOptions({qs:{ path: '/'} }).get('/hubs/documents/folders/contents');
  });
});

suite.forElement('documents', 'files', (test) => {
  documents.filesCRD();
  documents.fileMetadataRU();
});

documents.search();
