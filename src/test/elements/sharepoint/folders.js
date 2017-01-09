'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = require('./assets/folders');
const build = (overrides) => Object.assign({}, payload, overrides);
const foldersPayload = build({ path: `/${tools.random()}` });

suite.forElement('documents', 'folders', { payload: foldersPayload }, (test) => {
  it('should allow CRD for hubs/documents/folders and GET for hubs/documents/folders/metadata by path', () => {
    let srcPath;
    return cloud.post(test.api, foldersPayload)
      .then(r => srcPath = r.body.path)
      .then(r => cloud.withOptions({ qs: { path: `${srcPath}` } }).get(`${test.api}/contents`))
      .then(r => cloud.withOptions({ qs: { path: `${srcPath}`, page: 1, pageSize: 1 } }).get(`${test.api}/contents`))
      .then(r => cloud.withOptions({ qs: { path: `${srcPath}` } }).get(`${test.api}/metadata`))
      .then(r => cloud.withOptions({ qs: { path: `${srcPath}` } }).delete(test.api));
  });

  it('should allow CRD for hubs/documents/folders and GET for hubs/documents/folders/metadata by id', () => {
    let folderId;
    return cloud.post(test.api, foldersPayload)
      .then(r => folderId = r.body.id)
      .then(r => cloud.get(`${test.api}/${folderId}/contents`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${folderId}/contents`))
      .then(r => cloud.get(`${test.api}/${folderId}/metadata`))
      .then(r => cloud.delete(`${test.api}/${folderId}`));
  });
});
