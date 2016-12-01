'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const chakram = require('chakram');
const payload = require('./assets/assets');
const brandfolderPayload = require('./assets/brandfolders2');
const collectionsPayload = require('./assets/collections');
const expect = chakram.expect;

const updatePayload = () => ({
  "type": "assets",
  "attributes": {
    "name": "CE Asset"
  }
});

suite.forElement('general', 'assets', { payload: payload, skip: true }, (test) => {
  let orgId = -1, brandFolderId = -1, sectionId = -1, assetId = -1;
  before(() => cloud.get(`hubs/general/organizations`)
    .then(r => orgId = r.body[0].id)
    .then(r => cloud.post(`hubs/general/organizations/${orgId}/brandfolders`, brandfolderPayload))
    .then(r => brandFolderId = r.body.id)
    .then(r => cloud.get(`hubs/general/brandfolders/${brandFolderId}/sections`))
    .then(r => sectionId = r.body[0].id)
    .then(r => cloud.post(`hubs/general/sections/${sectionId}/assets`, payload))
    .then(r => assetId = r.body.id)
  );
  it('should support RU', () => {
    return cloud.get(`${test.api}/${assetId}`)
      .then(r => cloud.patch(`${test.api}/${assetId}`, updatePayload()))
      .then(r => cloud.get(`${test.api}/${assetId}`));
  });
  it('should support cursor pagination for brandfolders/{id}/assets', () => {
    const options = { qs:{ pageSize: 1 }};
    return cloud.withOptions(options).get(`hubs/general/brandfolders/${brandFolderId}/assets`)
      .then(r => {
        expect(r.body).to.not.be.null;
        options.qs.nextPage = r.response.headers['elements-next-page-token'];
        return cloud.withOptions(options).get(`hubs/general/brandfolders/${brandFolderId}/assets`);
      });
  });
  it('should support = CEQL search for brandfolders/{id}/assets', () => {
    const options = { qs:{ where: `name='CE Asset'`}};
    return cloud.withOptions(options).get(`hubs/general/brandfolders/${brandFolderId}/assets`)
      .then(r => {
        expect(r.body).to.not.be.null;
        return r;
      });
  });
  it('should support >= CEQL search for brandfolders/{id}/assets', () => {
    const options = { qs:{ where: `created_at>='2016-05-01'`}};
    return cloud.withOptions(options).get(`hubs/general/brandfolders/${brandFolderId}/assets`)
    .then(r => {
      expect(r.body).to.not.be.null;
      return r;
    });
  });
  it('should support cursor pagination for collections/{id}/assets', () => {
    const options = { qs:{ pageSize: 1 }};
    let collectionId = -1;
    return cloud.post(`hubs/general/brandfolders/${brandFolderId}/collections`, collectionsPayload)
      .then(r => collectionId = r.body.id)
      .then(r => cloud.withOptions(options).get(`hubs/general/collections/${collectionId}/assets`))
      .then(r => {
        expect(r.body).to.not.be.null;
        options.qs.nextPage = r.response.headers['elements-next-page-token'];
        return cloud.withOptions(options).get(`hubs/general/collections/${collectionId}/assets`);
      });
  });
  it('should support = CEQL search for collections/{id}/assets', () => {
    const options = { qs:{ where: `name='CE Asset'`}};
    return cloud.withOptions(options).get(`hubs/general/brandfolders/${brandFolderId}/collections`)
      .then(r => {
        expect(r.body).to.not.be.null;
        return r;
      });
  });
  it('should support >= CEQL search for collections/{id}/assets', () => {
    const options = { qs:{ where: `created_at>='2016-05-01'`}};
    return cloud.withOptions(options).get(`hubs/general/brandfolders/${brandFolderId}/collections`)
    .then(r => {
      expect(r.body).to.not.be.null;
      return r;
    });
  });
  it('should support cursor pagination for organizations/{id}/assets', () => {
    const options = { qs:{ pageSize: 1 }};
    return cloud.withOptions(options).get(`hubs/general/organizations/${orgId}/assets`)
      .then(r => {
        expect(r.body).to.not.be.null;
        options.qs.nextPage = r.response.headers['elements-next-page-token'];
        return cloud.withOptions(options).get(`hubs/general/organizations/${orgId}/assets`);
      });
  });
  it('should support = CEQL search for organizations/{id}/assets', () => {
    const options = { qs:{ where: `name='CE Asset'`}};
    return cloud.withOptions(options).get(`hubs/general/organizations/${orgId}/assets`)
      .then(r => {
        expect(r.body).to.not.be.null;
        return r;
      });
  });
  it('should support >= CEQL search for organizations/{id}/assets', () => {
    const options = { qs:{ where: `created_at>='2016-05-01'`}};
    return cloud.withOptions(options).get(`hubs/general/organizations/${orgId}/assets`)
    .then(r => {
      expect(r.body).to.not.be.null;
      return r;
    });
  });
  it('should support cursor pagination for sections/{id}/assets', () => {
    const options = { qs:{ pageSize: 1 }};
    return cloud.withOptions(options).get(`hubs/general/sections/${sectionId}/assets`)
      .then(r => {
        expect(r.body).to.not.be.null;
        options.qs.nextPage = r.response.headers['elements-next-page-token'];
        return cloud.withOptions(options).get(`hubs/general/sections/${sectionId}/assets`);
      });
  });
  it('should support = CEQL search for sections/{id}/assets', () => {
    const options = { qs:{ where: `name='CE Asset'`}};
    return cloud.withOptions(options).get(`hubs/general/sections/${sectionId}/assets`)
      .then(r => {
        expect(r.body).to.not.be.null;
        return r;
      });
  });
  it('should support >= CEQL search for sections/{id}/assets', () => {
    const options = { qs:{ where: `created_at>='2016-05-01'`}};
    return cloud.withOptions(options).get(`hubs/general/sections/${sectionId}/assets`)
    .then(r => {
      expect(r.body).to.not.be.null;
      return r;
    });
  });
  after(() => cloud.delete(`/hubs/general/brandfolders/${brandFolderId}`));
});
