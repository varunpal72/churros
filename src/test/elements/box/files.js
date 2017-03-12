'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');

const lock = () => ({
   "is_download_prevented" : false,
   "expires_at" : "2030-12-12T10:55:30-08:00"
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
      .then(r => { fileId = r.body.id; filePath = r.body.path; })
      .then(r => cloud.withOptions({ qs: { path: filePath, raw: true }}).get("/hubs/documents/files/links"))
      .then(r => expect(r.body).to.contain.key('raw'))
      .then(r => cloud.delete('/hubs/documents/files/' + fileId));
  });
});
