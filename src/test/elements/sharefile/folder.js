'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const payload = require('./assets/folder');
const cloud = require('core/cloud');
const tools = require('core/tools');
const rootFolder = '/My Files & Folders';
suite.forElement('documents', 'folders', (test) => {

let randomStr = tools.randomStr('abcdefghijklmnopqrstuvwxyz1234567890', 10);
payload.name += randomStr;
payload.path += randomStr;

  it('Testing folder creating/updating/deleting', () => {
    let folderId;
    let copyPath;
    let folderpath = rootFolder + `/churros-${randomStr}`;
    let metadataChange = folderpath + `/${randomStr}`;

    return cloud.post('/hubs/documents/folders', payload)
      .then(r => folderId = r.body.id)
      .then(r => cloud.get('hubs/documents/folders/' + folderId + '/contents'))
      .then(r => cloud.get('hubs/documents/folders/' + folderId + '/metadata'))
      .then(r => cloud.post('hubs/documents/folders/' + folderId + '/copy', { path: folderpath }))
      .then(r => cloud.patch('hubs/documents/folders/' + folderId + '/metadata', { path: metadataChange }))
      .then(r => copyPath = r.body.path)
      .then(r => cloud.delete('/hubs/documents/folders/' + folderId))
      .then(r => cloud.withOptions({ qs: { path: folderpath } }).delete('/hubs/documents/folders'));
  });

  test.withOptions({ qs: { path: '/' } }).withApi('/hubs/documents/folders/metadata').should.return200OnGet();

  it('Testing folder updating', () => {
    return cloud.withOptions({ qs: { path: '/My Files & Folders' } }).get('/hubs/documents/folders/contents')
      .then(r => cloud.withOptions({ qs: { path: r.body[0].path } }).patch('/hubs/documents/folders/metadata', r.body[0]))
      .then(r => cloud.patch('/hubs/documents/folders/' + r.body.id + '/metadata', r.body))
      .then(r => cloud.withOptions({ qs: { path: r.body.path } }).post('/hubs/documents/folders/copy', { path: rootFolder + `/churros-${tools.random()}` }))
      .then(r => cloud.withOptions({ qs: { path: r.body.path } }).post('hubs/documents/folders/favorites'))
      .then(r => cloud.delete('/hubs/documents/folders/' + r.body.id));
  });

  it('should disallow downloading a folder', () => {
    let folderId;
    return cloud.post('/hubs/documents/folders', payload)
      .then(r => folderId = r.body.id)
      .then(r => cloud.withOptions({ qs: { path: payload.path }}).get('/hubs/documents/files', (r) => {
        expect(r).to.have.statusCode(400);
        cloud.delete('/hubs/documents/folders/' + folderId);
      }));
  });

  test.withOptions({ qs: { text: 'test' } }).withApi('/hubs/documents/search').should.return200OnGet();

});
