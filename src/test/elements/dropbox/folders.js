'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('documents', 'folders', null, (test) => {

  it('should allow GET /folders/metadata for root folder by path & ID', () => {
    let rootPath = "/";
    let query = { path: rootPath };
    return cloud.withOptions({qs: query}).get("/hubs/documents/folders/metadata")
      .then(r => encodeURIComponent(r.body.id))
      .then(r => cloud.get(`/hubs/documents/folders/${r}/metadata`))
      .then(r => expect(r).to.have.statusCode(200))
  });
});
