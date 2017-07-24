'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const filesPath = `${__dirname}/assets/file.txt`;
const rootFolder = '/My Files & Folders';

const addFile = (r) => cloud.withOptions({ qs: { path: rootFolder + `/file-${tools.random()}.txt`} }).postFile('/hubs/documents/files', r);
suite.forElement('documents', 'polling', null, (test) => {
  test.withApi('/hubs/documents/files').should.supportPolling(filesPath, 'documents', addFile);
});
