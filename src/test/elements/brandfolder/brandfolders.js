'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const chakram = require('chakram');
const payload = require('./assets/brandfolders');
const payload2 = require('./assets/brandfolders2');
const expect = chakram.expect;

suite.forElement('general', 'brandfolders', { payload: payload, skip: true }, (test) => {
  let orgId = -1;
  before(() => cloud.get(`hubs/general/organizations`)
    .then(r => orgId = r.body[0].id)
    .then(r => cloud.get(`hubs/general/organizations/${orgId}`))
  );
  it('should support CRUDS and sub-resources', () => {
    let brandFolderId = -1;
    return cloud.post(`hubs/general/organizations/${orgId}/brandfolders`, payload2)
      .then(r => brandFolderId = r.body.id)
      .then(r => cloud.get(test.api))
      .then(r => cloud.get(`${test.api}/${brandFolderId}`))
      .then(r => cloud.patch(`${test.api}/${brandFolderId}`, payload))
      .then(r => expect(r.body.attributes.name).to.equal(`demo-cloud-elements`))
      .then(r => cloud.get(`${test.api}/${brandFolderId}/assets`))
      .then(r => cloud.get(`${test.api}/${brandFolderId}/collections`))
      .then(r => cloud.get(`${test.api}/${brandFolderId}/sections`))
      .then(r => cloud.delete(`${test.api}/${brandFolderId}`));
  });
  it('should support cursor pagination for organizations/{id}/brandfolders', () => {
    const options = { qs: { pageSize: 1}};
    return cloud.withOptions(options).get(`hubs/general/organizations/${orgId}/brandfolders`)
      .then(r => {
        expect(r.body).to.not.be.null;
        options.qs.nextPage = r.response.headers['elements-next-page-token'];
        return cloud.withOptions(options).get(`hubs/general/organizations/${orgId}/brandfolders`);
      });
  });
});
