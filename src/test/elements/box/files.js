'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');

const lock = () => ({
  "is_download_prevented": false,
  "expires_at": "2030-12-12T10:55:30-08:00"
});



suite.forElement('documents', 'files', null, (test) => {

  it('should allow PUT /files/:id/lock and DELETE /files/:id/lock', () => {
    let fileId;
    let path = __dirname + '/../assets/brady.jpg';
    let query = { path: `/brady-${tools.random()}.jpg` };
    return cloud.withOptions({ qs: query }).postFile('/hubs/documents/files', path)
      .then(r => fileId = r.body.id)
      .then(r => cloud.put('/hubs/documents/files/' + fileId + '/lock', null, null, lock))
      .then(r => cloud.delete('/hubs/documents/files/' + fileId + '/lock'))
      .then(r => cloud.delete(test.api + '/' + fileId));
  });

  it('should support links for files/:id/links without raw payload', () => {
    let fileId;
    let path = __dirname + '/../assets/brady.jpg';
    let query = { path: `/brady-${tools.random()}.jpg` };
    return cloud.withOptions({ qs: query }).postFile('/hubs/documents/files', path)
      .then(r => fileId = r.body.id)
      .then(r => cloud.get("/hubs/documents/files/" + fileId + "/links"))
      .then(r => expect(r.body).to.not.contain.key('raw'))
      .then(r => cloud.delete('/hubs/documents/files/' + fileId));
  });

  it('should support links for files/links with raw payload', () => {
    let fileId;
    let filePath;
    let path = __dirname + '/../assets/brady.jpg';
    let query = { path: `/brady-${tools.random()}.jpg` };
    return cloud.withOptions({ qs: query }).postFile('/hubs/documents/files', path)
      .then(r => { fileId = r.body.id;
        filePath = r.body.path; })
      .then(r => cloud.withOptions({ qs: { path: filePath, raw: true } }).get("/hubs/documents/files/links"))
      .then(r => expect(r.body).to.contain.key('raw'))
      .then(r => cloud.delete('/hubs/documents/files/' + fileId));
  });

  it('should fail when copying file with existing file name', () => {
    let fileId1;
    let fileId2;
    let filePath1;
    let filePath2;
    let path = __dirname + '/../assets/brady.jpg';
    let fileSuffix1 = tools.random();
    let fileSuffix2 = tools.random();
    let query1 = { path: `/brady-${fileSuffix1}.jpg` };
    let query2 = { path: `/brady-${fileSuffix2}.jpg` };

    return cloud.withOptions({ qs: query1 }).postFile('/hubs/documents/files', path)
      .then(r => { fileId1 = r.body.id;
        filePath1 = r.body.path; })
      .then(r => cloud.withOptions({ qs: query2 }).postFile('hubs/documents/files', path))
      .then(r => { fileId2 = r.body.id;
        filePath2 = r.body.path; })
      .then(r => cloud.withOptions({ qs: { path: filePath1, overwrite: false } }).post('/hubs/documents/files/copy', { path: filePath2 }, r => { expect(r).to.have.statusCode(409); }))
      .then(r => cloud.get(`/hubs/documents/files/${fileId2}/metadata`))
      .then(r => { expect(r).to.have.statusCode(200) && expect(r.body.id).to.equal(fileId2); })
      .then(r => cloud.delete('/hubs/documents/files/' + fileId1))
      .then(r => cloud.delete('/hubs/documents/files/' + fileId2));
  });
});
