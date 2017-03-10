'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const Buffer = require('buffer').Buffer;
const logger = require('winston');

const rootFolder = '/My Files & Folders';

const checkSize = (fileSize, downloadedSize) => {
  logger.debug("File size: " + fileSize + ", Downloaded Size: " + downloadedSize);

  return (fileSize === downloadedSize);
};

suite.forElement('documents', 'files', (test) => {
  let query = { path: rootFolder + `/file-${tools.random()}.txt` };
  let metadataPatch = { path: rootFolder + `/file-${tools.random()}.txt` };
  let copyPath = { path: rootFolder + `/churros-${tools.random()}.txt` };
  let fileId;
  let filePath;

  it('should get file metadata by id/path', () => {
    let path = __dirname + '/assets/file.txt';
    return cloud.postFile('/hubs/documents/files', path, { qs: query })
      .then(r => { fileId = r.body.id, filePath = r.body.path; })
      .then(r => cloud.get('/hubs/documents/files/' + fileId))
      .then(r => cloud.get('/hubs/documents/files/' + fileId + '/metadata'))
      .then(r => cloud.withOptions({ qs: { path: filePath } }).get('/hubs/documents/files'))
      .then(r => cloud.withOptions({ qs: { path: filePath } }).get('/hubs/documents/files/metadata'))
      .then(r => cloud.delete('/hubs/documents/files/' + fileId));
  });

  it('should delete file by path', () => {
    let path = __dirname + '/assets/file.txt';
    return cloud.postFile('/hubs/documents/files', path, { qs: query })
      .then(r => { fileId = r.body.id, filePath = r.body.path; })
      .then(r => cloud.withOptions({ qs: query }).delete('/hubs/documents/files'));
  });

  it('should patch file metadata by id/path', () => {
    let path = __dirname + '/assets/file.txt';
    return cloud.postFile('/hubs/documents/files', path, { qs: query })
      .then(r => { fileId = r.body.id, filePath = r.body.path; })
      .then(r => cloud.withOptions({ qs: { path: filePath } }).patch('hubs/documents/files/metadata', metadataPatch))
      .then(r => cloud.patch('hubs/documents/files/' + fileId + '/metadata', metadataPatch))
      .then(r => cloud.withOptions({ qs: metadataPatch }).delete('/hubs/documents/files'));
  });

  it('should copy file by id/path', () => {
    let path = __dirname + '/assets/file.txt';
    return cloud.postFile('/hubs/documents/files', path, { qs: query })
      .then(r => { fileId = r.body.id, filePath = r.body.path; })
      .then(r => cloud.get('/hubs/documents/files' + '/' + fileId + '/metadata'))
      .then(r => cloud.withOptions({ qs: { path: filePath } }).post('/hubs/documents/files/copy', copyPath))
      .then(r => cloud.withOptions({ qs: { path: r.body.path } }).delete('/hubs/documents/files'))
      .then(r => cloud.post('/hubs/documents/files/' + fileId + '/copy', copyPath))
      .then(r => cloud.delete('/hubs/documents/files/' + r.body.id));
  });

  it('should upload file by id/path', () => {
    let path = __dirname + '/assets/file.txt';
    return cloud.postFile('/hubs/documents/files', path, { qs: query })
      .then(r => fileId = r.body.id)
      .then(r => cloud.delete('/hubs/documents/files/' + fileId))
      .then(r => cloud.postFile('/hubs/documents/files', path, { qs: query }))
      .then(r => cloud.withOptions({ qs: { path: r.body.path } }).delete('/hubs/documents/files'));
  });

  it('should get file link by id/path', () => {
    let path = __dirname + '/assets/file.txt';
    return cloud.postFile('/hubs/documents/files', path, { qs: query })
      .then(r => { fileId = r.body.id, filePath = r.body.path; })
      .then(r => cloud.get("/hubs/documents/files/" + fileId + "/links"))
      .then(r => expect(r).to.have.statusCode(200) && expect(r.body.providerViewLink).to.not.be.null)
      .then(r => cloud.withOptions({ qs: { path: filePath } }).get("/hubs/documents/files/links"))
      .then(r => expect(r).to.have.statusCode(200) && expect(r.body.providerViewLink).to.not.be.null)
      .then(r => cloud.delete('/hubs/documents/files/' + fileId));
  });

  it('should validate unicode file download', () => {
    let path = __dirname + '/assets/unicode-file.txt';
    let fileSize;
    let downloadedSize;
    return cloud.postFile('/hubs/documents/files', path, { qs: query })
      .then(r => { fileId = r.body.id, filePath = r.body.path; })
      .then(r => cloud.get('/hubs/documents/files/' + fileId + '/metadata'))
      .then(r => fileSize = r.body.size)
      .then(r => cloud.get('/hubs/documents/files/' + fileId))
      .then(r => downloadedSize = Buffer.byteLength(r.body, "UTF-8"))
      .then(r => checkSize(fileSize, downloadedSize))
      .then(r => expect(r).to.be.true)
      .then(r => cloud.delete('/hubs/documents/files/' + fileId));
  });
});
