'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('documents', 'files', { skip: true }, (test) => {
  it('should allow ping for sfdcdocuments', () => {
    return cloud.get(`/hubs/documents/ping`);
  });
  let payload = {
    "path": "/filepathsuite.txt"
  };
  //no storage space for POST files on vendor side
  it('should allow CRD for hubs/documents/files and GET for hubs/documents/files/metadata by path', () => {
    let UploadFile = __dirname + '/assets/Penguins.jpg',
      srcPath;
    return cloud.withOptions({ qs: { path: `/${UploadFile.split('/')[this.length]}` } }).postFile(test.api, UploadFile)
      .then(r => srcPath = r.body.path)
      .then(r => cloud.withOptions({ qs: { path: `${srcPath}` } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { path: `${srcPath}` } }).get(`${test.api}/metadata`))
      .then(r => cloud.withOptions({ qs: { path: `/filepathsuite.txt` } }).get(`${test.api}/metadata`, { "path": "/filepathsuite.txt" }))
      .then(r => cloud.withOptions({ qs: { path: `${srcPath}` } }).delete(test.api))
      .then(r => cloud.withOptions({ qs: { path: "/filepathsuite.txt" } }).patch(`${test.api}/metadata`, payload));
  });
  //no storage space for POST files on vendor side
  it('should allow CRD for hubs/documents/files and GET for hubs/documents/files/metadata by id', () => {
    let UploadFile = __dirname + '/assets/Penguins.jpg',
      fileId;
    return cloud.withOptions({ qs: { path: `/${UploadFile.split('/')[this.length]}` } }).postFile(test.api, UploadFile)
      .then(r => fileId = r.body.id)
      .then(r => cloud.get(`${test.api}/${fileId}`))
      .then(r => cloud.get(`${test.api}/${fileId}/metadata`))
      .then(r => cloud.patch(`${test.api}/${fileId}/metadata`, payload))
      .then(r => cloud.delete(`${test.api}/${fileId}`));
  });
});
