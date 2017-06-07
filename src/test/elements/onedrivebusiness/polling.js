'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const foldersPayload = tools.requirePayload(`${__dirname}/assets/folders.json`);
const filesPath = `${__dirname}/assets/brady.jpg`;

const addFile = (r) => cloud.withOptions({ qs: { path: `/brady-${tools.random()}.jpg` } }).postFile('/hubs/documents/files', r);
suite.forElement('documents', 'polling', null, (test) => {
  test.withApi('/hubs/documents/folders').should.supportPolling(foldersPayload, 'documents');
  test.withApi('/hubs/documents/files').should.supportPolling(filesPath, 'documents', addFile);
});
