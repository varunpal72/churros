'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const chakram = require('chakram');
const expect = chakram.expect;
const options = {};
const options2 = {};

suite.forElement('general', 'sections', null, (test) => {
  let orgId = -1;
  let brandFolderId = -1;
  before(() => cloud.get(`hubs/general/organizations`)
    .then(r => orgId = r.body[0].id)
    .then(r => cloud.get(`hubs/general/organizations/${orgId}/brandfolders`))
    .then(r => brandFolderId = r.body[0].id)
    .then(r => cloud.get(`hubs/general/brandfolders/${brandFolderId}`))
    .then(r => expect(r.body.attributes.name).to.equal(`demo-cloud-elements`))
  );
  it('should support Sr and sub-resources', () => {
    let sectionId = -1;
    return cloud.get(`hubs/general/brandfolders/${brandFolderId}/sections`)
      .then(r => sectionId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${sectionId}`))
      .then(r => cloud.get(`${test.api}/${sectionId}/assets`));
  });
  options.qs = {};
  options.qs.pageSize = 1;
  it('should support cursor pagination for brandfolders/sections', () => {
    return cloud.withOptions(options).get(`hubs/general/brandfolders/${brandFolderId}/sections`)
      .then(r => {
        expect(r.body).to.not.be.null;
        options.qs.nextPage = r.response.headers['elements-next-page-token'];
        return cloud.withOptions(options).get(`hubs/general/brandfolders/${brandFolderId}/sections`);
      });
  });
  options2.qs = {};
  options2.qs.pageSize = 1;
  it('should support cursor pagination for collections/sections', () => {
    let collectionId = -1;
    return cloud.get(`hubs/general/brandfolders/${brandFolderId}/collections`)
      .then(r => collectionId = r.body[0].id)
      .then(r => cloud.withOptions(options2).get(`hubs/general/collections/${collectionId}/sections`))
      .then(r => {
        expect(r.body).to.not.be.null;
        options2.qs.nextPage = r.response.headers['elements-next-page-token'];
        return cloud.withOptions(options2).get(`hubs/general/collections/${collectionId}/sections`);
      });
  });
});
