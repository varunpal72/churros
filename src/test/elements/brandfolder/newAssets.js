'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const chakram = require('chakram');
const payload = require('./assets/assets');
const expect = chakram.expect;
const whereQuery = {};
const whereQueryGT = {};

const updatePayload = () => ({
  "type": "assets",
  "attributes": {
    "name": "CE Asset"
  }
});

suite.forElement('general', 'assets', { payload: payload }, (test) => {
  let orgId = -1, brandFolderId = -1, sectionId = -1, assetId = -1;
  before(() => cloud.get(`hubs/general/organizations`)
    .then(r => orgId = r.body[0].id)
    .then(r => cloud.get(`hubs/general/organizations/${orgId}/brandfolders`))
    .then(r => brandFolderId = r.body[0].id)
    .then(r => cloud.get(`hubs/general/brandfolders/${brandFolderId}`))
    .then(r => expect(r.body.attributes.name).to.equal(`demo-cloud-elements`))
    .then(r => cloud.get(`hubs/general/brandfolders/${brandFolderId}/sections`))
    .then(r => sectionId = r.body[0].id)
    .then(r => cloud.post(`hubs/general/sections/${sectionId}/assets`, payload))
    .then(r => assetId = r.body.id)
  );
  whereQuery.qs = {};
  whereQuery.qs.where = `name='CE Asset'`;
  whereQueryGT.qs = {};
  whereQueryGT.qs.where = `created_at>='2016-05-01'`;
  it('should support RU', () => {
    return cloud.get(`${test.api}/${assetId}`)
      .then(r => cloud.patch(`${test.api}/${assetId}`, updatePayload()))
      .then(r => cloud.get(`${test.api}/${assetId}`));
  });
  it('should support cursor pagination for brandfolders/{id}/assets', () => {
    const options = {};
    options.qs = {};
    options.qs.pageSize = 1;
    return cloud.withOptions(options).get(`hubs/general/brandfolders/${brandFolderId}/assets`)
      .then(r => {
        expect(r.body).to.not.be.null;
        options.qs.nextPage = r.response.headers['elements-next-page-token'];
        return cloud.withOptions(options).get(`hubs/general/brandfolders/${brandFolderId}/assets`);
      });
  });
  it('should support = CEQL search for brandfolders/{id}/assets', () => {
    return cloud.withOptions(whereQuery).get(`hubs/general/brandfolders/${brandFolderId}/assets`)
      .then(r => {
        expect(r.body).to.not.be.null;
        return r;
      });
  });
  it('should support >= CEQL search for brandfolders/{id}/assets', () => {
    return cloud.withOptions(whereQueryGT).get(`hubs/general/brandfolders/${brandFolderId}/assets`)
    .then(r => {
      expect(r.body).to.not.be.null;
      return r;
    });
  });
  it('should support cursor pagination for collections/{id}/assets', () => {
    const options = {};
    options.qs = {};
    options.qs.pageSize = 1;
    let collectionId = -1;
    return cloud.get(`hubs/general/brandfolders/${brandFolderId}/collections`)
      .then(r => collectionId = r.body[0].id)
      .then(r => cloud.withOptions(options).get(`hubs/general/collections/${collectionId}/assets`))
      .then(r => {
        expect(r.body).to.not.be.null;
        options.qs.nextPage = r.response.headers['elements-next-page-token'];
        return cloud.withOptions(options).get(`hubs/general/collections/${collectionId}/assets`);
      });
  });
  it('should support = CEQL search for collections/{id}/assets', () => {
    return cloud.withOptions(whereQuery).get(`hubs/general/brandfolders/${brandFolderId}/collections`)
      .then(r => {
        expect(r.body).to.not.be.null;
        return r;
      });
  });
  it('should support >= CEQL search for collections/{id}/assets', () => {
    return cloud.withOptions(whereQueryGT).get(`hubs/general/brandfolders/${brandFolderId}/collections`)
    .then(r => {
      expect(r.body).to.not.be.null;
      return r;
    });
  });
  it('should support cursor pagination for organizations/{id}/assets', () => {
    const options = {};
    options.qs = {};
    options.qs.pageSize = 1;
    return cloud.withOptions(options).get(`hubs/general/organizations/${orgId}/assets`)
      .then(r => {
        expect(r.body).to.not.be.null;
        options.qs.nextPage = r.response.headers['elements-next-page-token'];
        return cloud.withOptions(options).get(`hubs/general/organizations/${orgId}/assets`);
      });
  });
  it('should support = CEQL search for organizations/{id}/assets', () => {
    return cloud.withOptions(whereQuery).get(`hubs/general/organizations/${orgId}/assets`)
      .then(r => {
        expect(r.body).to.not.be.null;
        return r;
      });
  });
  it('should support >= CEQL search for organizations/{id}/assets', () => {
    return cloud.withOptions(whereQueryGT).get(`hubs/general/organizations/${orgId}/assets`)
    .then(r => {
      expect(r.body).to.not.be.null;
      return r;
    });
  });
  it('should support cursor pagination for sections/{id}/assets', () => {
    const options = {};
    options.qs = {};
    options.qs.pageSize = 1;
    return cloud.withOptions(options).get(`hubs/general/sections/${sectionId}/assets`)
      .then(r => {
        expect(r.body).to.not.be.null;
        options.qs.nextPage = r.response.headers['elements-next-page-token'];
        return cloud.withOptions(options).get(`hubs/general/sections/${sectionId}/assets`);
      });
  });
  it('should support = CEQL search for sections/{id}/assets', () => {
    return cloud.withOptions(whereQuery).get(`hubs/general/sections/${sectionId}/assets`)
      .then(r => {
        expect(r.body).to.not.be.null;
        return r;
      });
  });
  it('should support >= CEQL search for sections/{id}/assets', () => {
    return cloud.withOptions(whereQueryGT).get(`hubs/general/sections/${sectionId}/assets`)
    .then(r => {
      expect(r.body).to.not.be.null;
      return r;
    });
  });
  after(() => cloud.delete(`${test.api}/${assetId}`));
});
