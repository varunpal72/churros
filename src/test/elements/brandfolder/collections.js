'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const chakram = require('chakram');
const payload = require('./assets/collections');
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
    .then(r => cloud.get(`hubs/general/organizations/${orgId}/brandfolders`))
    .then(r => brandFolderId = r.body[0].id)
    .then(r => cloud.get(`hubs/general/brandfolders/${brandFolderId}`))
    .then(r => expect(r.body.attributes.name).to.equal(`demo-cloud-elements`))
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
  // They are returning a 500 from this request ... notified
  // it('should support cursor pagination for brandfolders/{id}/collections', () => {
  //   const options = {};
  //   options.qs = {};
  //   options.qs.pageSize = 1;
  //   return cloud.withOptions(options).get(`hubs/general/brandfolders/${brandFolderId}/collections`)
  //     .then(r => {
  //       expect(r.body).to.not.be.null;
  //       options.qs.nextPage = r.response.headers['elements-next-page-token'];
  //       return cloud.withOptions(options).get(`hubs/general/brandfolders/${brandFolderId}/collections`);
  //     });
  // });
});
