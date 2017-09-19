'use strict';

const chakram = require('chakram');
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

  it('should copy folder', () => {
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

  it('should update folder', () => {
    let folderId, folderPath;
    let updateFolder = {
      "path": "/My Files & Folders/Alan",
      "name": "Alan"
    };

    return cloud.post('/hubs/documents/folders', payload)
      .then(r => { folderPath = r.body.path; })
      .then(r => cloud.withOptions({ qs: { path: folderPath } }).patch('/hubs/documents/folders/metadata', updateFolder))
      .then(r => { folderId = r.body.id; })
      .then(r => cloud.delete(`${test.api}/${folderId}`))
      .then(r => cloud.post('/hubs/documents/folders', payload))
      .then(r => { folderId = r.body.id; })
      .then(r => cloud.patch(`${test.api}/${folderId}/metadata`, updateFolder))
      .then(r => cloud.delete(`${test.api}/${folderId}`));
  });

  it('should disallow downloading a folder', () => {
    let folderId;
    return cloud.post('/hubs/documents/folders', payload).then(r => folderId = r.body.id).then(
      r => cloud.withOptions({ qs: { path: payload.path } }).get('/hubs/documents/files', (r) => {
        expect(r).to.have.statusCode(400);
        cloud.delete('/hubs/documents/folders/' + folderId);
      }));
  });

  it('should concurrently create folders', () => {
    const createManyFolders = () => {
      let parentFolder = rootFolder + `/churros-${tools.random()}`;
      let folderPaths = [];

      folderPaths.push(parentFolder);

      let folderPayload = { path: folderPaths[0], directory: true };
      let response = cloud.post('/hubs/documents/folders', folderPayload);
      let promises = [];

      promises.push(response);

      for (var i = 0; i < 5; i++) {
        folderPaths.push(`${parentFolder}/${i}`);
        folderPayload = { path: folderPaths[i + 1], directory: true };
        response = cloud.post('/hubs/documents/folders', folderPayload);
        promises.push(response);
      }

      return chakram.all(promises);
    };

    return createManyFolders()
      .then(r => r.reverse().forEach(folder => { cloud.delete('/hubs/documents/folders/' + folder.body.id); }));
  });

  test.withOptions({ qs: { text: 'test' } }).withApi('/hubs/documents/search').should.return200OnGet();

});
