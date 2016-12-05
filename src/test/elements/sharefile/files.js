'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const rootFolder = '/My Files & Folders';
suite.forElement('documents', 'files', (test) => {
  let query = { path: rootFolder + `/file-${tools.random()}.txt` };
  let metadataPatch = { path: rootFolder + `/file-${tools.random()}.txt` };
  console.log('query: ', query, 'metadatapatch: ',metadataPatch);
  let fileId;
  let copyId1;
  let copyPath = { path: rootFolder + `/churros-${tools.random()}.txt`};

  it('Testing file uploading/getting/deleting', () => {
    let path = __dirname + '/assets/file.txt';
    return cloud.postFile('/hubs/documents/files', path, { qs:query})
    .then(r => fileId = r.body.id)
    .then(r => cloud.get('/hubs/documents/files'+ '/' + fileId))
    .then(r => cloud.get('/hubs/documents/files'+ '/' + fileId + '/metadata'));
    cloud.withOptions({ qs: query }).withApi('/hubs/documents/files').should.return200OnGet();
    cloud.withOptions({qs: query}).delete('/hubs/documents/files');

  });
  it('Testing file metadataing', () => {
    let path = __dirname + '/assets/file.txt';
    return cloud.postFile('/hubs/documents/files', path, { qs:query})
    .then(r => fileId = r.body.id)
    .then(r => cloud.patch('hubs/documents/files/' + fileId + '/metadata', metadataPatch));
    cloud.withOptions({qs: query}).delete('/hubs/documents/files');

  });

  it('Testing file copy and delete', () => {
    let path = __dirname + '/assets/file.txt';
    return cloud.postFile('/hubs/documents/files', path, { qs:query})
    .then(r => fileId = r.body.id)
    .then(r => cloud.get('/hubs/documents/files'+ '/' + fileId + '/metadata'))
    .then(r => cloud.withOptions({ qs: {path : r.body.path } }).post('/hubs/documents/files/copy', copyPath))
    .then(r => copyPath = r.body.path);
    cloud.withOptions({qs: {path: copyPath}}).delete('/hubs/documents/files');
  });



  it('Testing file deleting', () => {
    let path = __dirname + '/assets/file.txt';
    return cloud.postFile('/hubs/documents/files', path, { qs:query})
    .then(r => fileId = r.body.id)
    .then(r => cloud.delete('/hubs/documents/files/' + fileId))





  });
});
