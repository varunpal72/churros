'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const props = require('core/props');
const tools = require('core/tools');
const folderPayload = require('./assets/folders');

suite.forElement('documents', 'folders', (test) => {
  let rootId = "%252F";
  let rootPath = "/";
  let memberId = props.getForKey('dropboxbusiness', 'username');
  let random = `${tools.randomStr('abcdefghijklmnopqrstuvwxyz1234567890', 20)}`;

  it('should allow GET /folders/metadata for root folder', () => {
    let query = { path: rootPath };
    return cloud.withOptions({qs: query, headers: { "Elements-As-Team-Member": memberId }}).get("/hubs/documents/folders/metadata")
      .then(r => {
        expect(r).to.have.statusCode(200);
        expect(r.body.id).to.equal(rootId);
        expect(r.body.path).to.equal(rootPath);
        expect(r.body.directory).to.equal(true);
      });
    });

  it('should allow GET /folders/:id/metadata for root folder', () => {
    let folderId = rootId;
    return cloud.withOptions({headers: { "Elements-As-Team-Member": memberId }}).get(`/hubs/documents/folders/${folderId}/metadata`)
      .then(r => {
        expect(r).to.have.statusCode(200);
        expect(r.body.id).to.equal(rootId);
        expect(r.body.path).to.equal(rootPath);
        expect(r.body.directory).to.equal(true);
      });
   });

   const folderWrap = (cb) => {
     let folder;
     folderPayload.path += `-${random}`;
     folderPayload.name += `-${random}`;
     return cloud.withOptions({ headers: { "Elements-As-Team-Member": memberId } }).post('/hubs/documents/folders', folderPayload)
       .then(r => folder = r.body)
       .then(r => cb(folder))
       .then(r => cloud.withOptions({ headers: { "Elements-As-Team-Member": memberId } }).delete(`/hubs/documents/folders/${folder.refId}`));
   };

   it('should allow CREATE /folders and DELETE /folders/:refId', () => {
     const cb = (folder) => {
     return cloud.withOptions({ headers: { "Elements-As-Team-Member": memberId } }).post('/hubs/documents/folders', folderPayload)
       .then(r => folder1 = r.body)
       .then(r => cloud.withOptions({ qs: { path: folder1.path }, headers: { "Elements-As-Team-Member": memberId } }).delete('/hubs/documents/folders'))
       .then(() => cloud.withOptions({ headers: { "Elements-As-Team-Member": memberId } }).post('/hubs/documents/folders', folderPayload))
       .then(r => folder2 = r.body)
       .then(r => cloud.withOptions({ headers: { "Elements-As-Team-Member": memberId } }).delete(`/hubs/documents/folders/${folder.refId}`));
     };
   });


   it('should allow GET /folders/:refId/contents', () => {
     const cb = (folder) => {
       return cloud.withOptions({ headers: { "Elements-As-Team-Member": memberId } }).get(`/hubs/documents/folders/${folder.refId}/contents`);
     };

     return folderWrap(cb);
   });

   it('RU /folders/:refId/metadata', () => {
     const cb = (folder) => {
       let tempFolder = {
         path: `/a-${folder.name}`
       };
       return cloud.withOptions({ headers: { "Elements-As-Team-Member": memberId } }).get(`/hubs/documents/folders/${folder.refId}/metadata`)
         .then(r => cloud.withOptions({ headers: { "Elements-As-Team-Member": memberId } }).patch(`/hubs/documents/folders/${folder.refId}/metadata`, tempFolder));
     };

     return folderWrap(cb);
   });

   it('should allow POST /folders/:refId/copy', () => {

     const copy1 = { path: `/churrosCopy1-${random}` };

     const cb = (folder) => {
       let folderCopy;
       return cloud.withOptions({ headers: { "Elements-As-Team-Member": memberId } }).post(`/hubs/documents/folders/${folder.refId}/copy?overwrite=true`, copy1)
         .then(r => folderCopy = r.body)
         .then(r => cloud.withOptions({ headers: { "Elements-As-Team-Member": memberId } }).delete(`/hubs/documents/folders/${folderCopy.refId}`))
     };

     return folderWrap(cb);
   });

});
