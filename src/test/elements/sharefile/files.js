'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const expect = require('chakram').expect;

suite.forElement('documents', 'files', (test) => {
  let query = { path: `/My files & Folders/file-${tools.random()}.txt` };
  let fileId;
  let copyId1;
  let copyId2;
  let copyPath = { path: `/My Files & Folders`};

  it('Testing file uploading/downloading', () => {
    let resbody;
    let filePath;
    let metadata;
    let path = __dirname + '/assets/file.txt';
    return cloud.postFile('/hubs/documents/files', path, { qs:query})
    .then(r => fileId = r.body['id'])
    .then(r => cloud.get('/hubs/documents/files'+ '/' + fileId, (r) => expect(r).to.have.statusCode(200)))
    .then(r => cloud.get('/hubs/documents/files'+ '/' + fileId + '/metadata', (r) => expect(r).to.have.statusCode(200)))
    .then(r => cloud.post('/hubs/documents/files'+ '/' + fileId + '/copy', copyPath))
    .then(r => copyId1 = r.body['id']);
  })
  test.withOptions({qs:query}).withApi('/hubs/documents/files').should.return200OnGet();
//  test.withOptions({qs:query}).withApi('/hubs/documents/files/metadata').should.return200OnGet();


  it('Testing file copy and delete', () => {
    return cloud.get('/hubs/documents/files/' + copyId1 + '/metadata')
    .then(r =>   cloud.withOptions({ qs: {path : r.body['path'] } }).post('/hubs/documents/files/copy', {"path":"/My Files & Folders"}))
    .then(r => copyPath = r.body['path'])
    .then(r => cloud.withOptions({qs: {path: copyPath}}).delete('/hubs/documents/files'));
  })


  it('Testing file deleting', () => {
    let path = __dirname + '/assets/file.txt';
    return cloud.postFile('/hubs/documents/files', path, { qs:query})
    .then(r => fileId = r.body['id'])
    .then(r => cloud.delete('/hubs/documents/files/' + fileId))

  })
});
