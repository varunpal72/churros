'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const folderPayload = require('./assets/folders');

suite.forElement('documents', 'folders', (test) => {

  const folderWrap = (cb) => {
    let folder;
    let random = `${tools.random()}`;
    folderPayload.path += `-${random}`;
    folderPayload.name += `-${random}`;
    let copyPath = "/"+tools.random()+"/"+ folderPayload.name;
    let copyPath2 = "/"+tools.random()+"/"+ folderPayload.name;
    const build = (overrides) => Object.assign({}, folderPayload, overrides);
    const folderCopyPayload = build({ name: folderPayload.name, path: copyPath });
    const folderCopyPayload2 = build({ name: folderPayload.name, path: copyPath2 });
    return cloud.post('/hubs/documents/folders', folderPayload)
      .then(r => folder = r.body)
      .then(r => cb(folder))
      .then(r => cloud.withOptions({ qs: { path: folder.path } }).post('/hubs/documents/folders/copy',folderCopyPayload))
      .then(r => cloud.post(`/hubs/documents/folders/${folder.id}/copy`,folderCopyPayload2))
      .then(r => cloud.withOptions({ qs: { path: folder.path } }).delete('/hubs/documents/folders'));
  };

  it('should allow CD /folders', () => {
    let folder1;
    return cloud.post('/hubs/documents/folders', folderPayload)
      .then(r => folder1 = r.body)
      .then(r => cloud.withOptions({ qs: { path: folder1.path } }).delete('/hubs/documents/folders'));
  });

  it('should allow C /folders and DELETE /folders/:id', () => {
    let folder2;
    return cloud.post('/hubs/documents/folders', folderPayload)
      .then(r => folder2 = r.body)
      .then(r => cloud.delete(`/hubs/documents/folders/${folder2.id}`));
  });


  it('should allow GET /folders/contents and GET /folders/:id/contents', () => {
    const cb = (folder) => {
      return cloud.withOptions({ qs: { path: folder.path } }).get('/hubs/documents/folders/contents')
        .then(r => cloud.get(`/hubs/documents/folders/${folder.id}/contents`));
    };

    return folderWrap(cb);
  });

  it('should allow RU /folders/metadata and RU /folders/:id/metadata', () => {
    const cb = (folder) => {
      let updatedFolder;
      let folderTemp = {
        path: folder.path + "22tt"
      };
      return cloud.withOptions({ qs: { path: folder.path } }).get('/hubs/documents/folders/metadata')
        .then(r => cloud.withOptions({ qs: { path: folder.path } }).patch('/hubs/documents/folders/metadata', folderTemp))
        .then(r => updatedFolder = r.body)
        .then(r => cloud.get(`/hubs/documents/folders/${updatedFolder.id}/metadata`))
        .then(r => cloud.patch(`/hubs/documents/folders/${updatedFolder.id}/metadata`, folder));

    };
    return folderWrap(cb);
  });
});
