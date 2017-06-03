'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('documents', 'folders', (test) => {

  it('should allow GET /folders/metadata for root folder by path & ID', () => {
    let id;
    let rootId = "%2F";
    let rootPath = "/";
    let query = { path: rootPath };
    return cloud.withOptions({qs: query}).get("/hubs/documents/folders/metadata")
      .then(r => {
        expect(r).to.have.statusCode(200);
        expect(r.body.id).to.equal(rootId);
        expect(r.body.path).to.equal(rootPath);
        expect(r.body.directory).to.equal(true);
      });

    id = encodeURIComponent(rootId);
    return cloud.get(`/hubs/documents/folders/${rootId}/metadata`)
    .then(r => {
      expect(r).to.have.statusCode(200);
      expect(r.body.id).to.equal(rootId);
      expect(r.body.path).to.equal(rootPath);
      expect(r.body.directory).to.equal(true);
    });
  });
});
