'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = require('./assets/folders');
const updatePayload ={
        path:`/${tools.random()}`
 };

suite.forElement('documents', 'folders',{ payload: payload }, (test) => {
    it('should allow CRD for hubs/documents/folders and RU for hubs/documents/folders/metadata by path', () => {
    let srcPath,destPath;
    return cloud.post(`${test.api}`, payload)
      .then(r => srcPath = r.body.path)
      .then(r => cloud.withOptions({ qs: { path:`${srcPath}` } }).get(`${test.api}/contents`))
      .then(r => cloud.withOptions({ qs: { path:`${srcPath}`, page: 1, pageSize: 1 } }).get(`${test.api}/contents`))
      .then(r => cloud.withOptions({ qs: { path:`${srcPath}` } }).post(`${test.api}/copy`,updatePayload))
      .then(r => destPath = r.body.path)
      .then(r => cloud.withOptions({ qs: { path:`${srcPath}` } }).get(`${test.api}/metadata`))
      .then(r => cloud.withOptions({ qs: { path:`${srcPath}` } }).patch(`${test.api}/metadata`, updatePayload))
      .then(r => srcPath = r.body.path)
      .then(r => cloud.withOptions({ qs: { path:`${srcPath}` } }).delete(`${test.api}`))
      .then(r => cloud.withOptions({ qs: { path:`${destPath}` } }).delete(`${test.api}`));
    });

    it('should allow CRD for hubs/documents/folders and RU for hubs/documents/folders/metadata by id', () => {
    let folderId,destPath;
    return cloud.post(`${test.api}`, payload)
      .then(r => folderId = r.body.id)
      .then(r => cloud.get(`${test.api}/${folderId}/contents`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${folderId}/contents`))
      .then(r => cloud.post(`${test.api}/${folderId}/copy`,updatePayload))
      .then(r => destPath = r.body.path)
      .then(r => cloud.get(`${test.api}/${folderId}/metadata`))
      .then(r => cloud.patch(`${test.api}/${folderId}/metadata`, updatePayload))
      .then(r => folderId = r.body.id)
      .then(r => cloud.delete(`${test.api}/${folderId}`))
      .then(r => cloud.withOptions({ qs: { path:`${destPath}` } }).delete(`${test.api}`));
    });
});
