'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const props = require('core/props');

suite.forElement('documents', 'folders', (test) => {
  let rootId = "%252F";
  let rootPath = "/";
  let memberId = props.getForKey('dropboxbusinessv2', 'username');

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

  it('should allow GET /folders/{id}/metadata for root folder', () => {
    let folderId = rootId;
    return cloud.withOptions({headers: { "Elements-As-Team-Member": memberId }}).get(`/hubs/documents/folders/${folderId}/metadata`)
      .then(r => {
        expect(r).to.have.statusCode(200);
        expect(r.body.id).to.equal(rootId);
        expect(r.body.path).to.equal(rootPath);
        expect(r.body.directory).to.equal(true);
      });
   });
});
