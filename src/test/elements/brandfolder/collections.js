'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/collections');
const brandfolderPayload = require('./assets/brandfolders2');
const chakram = require('chakram');
const expect = chakram.expect;

const updatePayload = () => ({
    "type" : "collections",
    "attributes" : {
      "name" : "Cloud Elements",
      "slug" : "ceupdate"
    }
});

suite.forElement('general', 'collections', { payload: payload }, (test) => {
  let orgId = -1, brandFolderId = -1;
  before(() => cloud.get(`hubs/general/organizations`)
    .then(r => orgId = r.body[0].id)
    .then(r => cloud.post(`hubs/general/organizations/${orgId}/brandfolders`, brandfolderPayload))
    .then(r => brandFolderId = r.body.id)
  );
  it('should support CRUDS and sub-resources', () => {
    let collectionId = -1;
    return cloud.post(`hubs/general/brandfolders/${brandFolderId}/collections`, payload)
      .then(r => collectionId = r.body.id)
      .then(r => cloud.get(`${test.api}/${collectionId}`))
      .then(r => cloud.patch(`${test.api}/${collectionId}`, updatePayload()))
      .then(r => cloud.get(`${test.api}/${collectionId}/assets`))
      .then(r => cloud.get(`${test.api}/${collectionId}/sections`))
      .then(r => cloud.delete(`${test.api}/${collectionId}`));
  });
  it('should support cursor pagination for brandfolders/{id}/collections', () => {
    const options = { qs: { pageSize: 1}};
    return cloud.withOptions(options).get(`hubs/general/brandfolders/${brandFolderId}/collections`)
      .then(r => {
        expect(r.body).to.not.be.null;
        options.qs.nextPage = r.response.headers['elements-next-page-token'];
        return cloud.withOptions(options).get(`hubs/general/brandfolders/${brandFolderId}/collections`);
      });
  });
  after(() => cloud.delete(`/hubs/general/brandfolders/${brandFolderId}`));
});
