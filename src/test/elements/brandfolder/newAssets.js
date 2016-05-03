'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const chakram = require('chakram');
const payload = require('./assets/assets');
const expect = chakram.expect;
const options = {};
const options2 = {};
const options3 = {};
const options4 = {};
const whereQuery = {};
const whereQueryGT = {};

const updatePayload = () => ({
  "type": "assets",
  "attributes": {
    "name": "CE Asset"
  }
});

suite.forElement('general', 'assets', { payload: payload }, (test) => {
  let orgId = -1;
  let brandFolderId = -1;
  let sectionId = -1;
  let assetId = -1;
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
  it('should support Ru', () => {
    return cloud.get(`${test.api}/${assetId}`)
      .then(r => cloud.patch(`${test.api}/${assetId}`, updatePayload()))
      .then(r => cloud.get(`${test.api}/${assetId}`));
  });
  options.qs = {};
  options.qs.pageSize = 1;
  it('should support cursor pagination for brandfolders/assets', () => {
    return cloud.withOptions(options).get(`hubs/general/brandfolders/${brandFolderId}/assets`)
      .then(r => {
        expect(r.body).to.not.be.null;
        options.qs.nextPage = r.response.headers['elements-next-page-token'];
        return cloud.withOptions(options).get(`hubs/general/brandfolders/${brandFolderId}/assets`);
      });
  });
  it('should support = CEQL search for brandfolders/assets', () => {
    return cloud.withOptions(whereQuery).get(`hubs/general/brandfolders/${brandFolderId}/assets`)
      .then(r => {
        expect(r.body).to.not.be.null;
        return r;
      });
  });
  it('should support >= CEQL search for brandfolders/assets', () => {
    return cloud.withOptions(whereQueryGT).get(`hubs/general/brandfolders/${brandFolderId}/assets`)
    .then(r => {
      expect(r.body).to.not.be.null;
      return r;
    });
  });
  options2.qs = {};
  options2.qs.pageSize = 1;
  it('should support cursor pagination for collections/assets', () => {
    let collectionId = -1;
    return cloud.get(`hubs/general/brandfolders/${brandFolderId}/collections`)
      .then(r => collectionId = r.body[0].id)
      .then(r => cloud.withOptions(options2).get(`hubs/general/collections/${collectionId}/assets`))
      .then(r => {
        expect(r.body).to.not.be.null;
        options2.qs.nextPage = r.response.headers['elements-next-page-token'];
        return cloud.withOptions(options2).get(`hubs/general/collections/${collectionId}/assets`);
      });
  });
  it('should support = CEQL search for collections/assets', () => {
    return cloud.withOptions(whereQuery).get(`hubs/general/brandfolders/${brandFolderId}/collections`)
      .then(r => {
        expect(r.body).to.not.be.null;
        return r;
      });
  });
  it('should support >= CEQL search for collections/assets', () => {
    return cloud.withOptions(whereQueryGT).get(`hubs/general/brandfolders/${brandFolderId}/collections`)
    .then(r => {
      expect(r.body).to.not.be.null;
      return r;
    });
  });
  options3.qs = {};
  options3.qs.pageSize = 1;
  it('should support cursor pagination for organizations/assets', () => {
    return cloud.withOptions(options3).get(`hubs/general/organizations/${orgId}/assets`)
      .then(r => {
        expect(r.body).to.not.be.null;
        options3.qs.nextPage = r.response.headers['elements-next-page-token'];
        return cloud.withOptions(options3).get(`hubs/general/organizations/${orgId}/assets`);
      });
  });
  it('should support = CEQL search for organizations/assets', () => {
    return cloud.withOptions(whereQuery).get(`hubs/general/organizations/${orgId}/assets`)
      .then(r => {
        expect(r.body).to.not.be.null;
        return r;
      });
  });
  it('should support >= CEQL search for organizations/assets', () => {
    return cloud.withOptions(whereQueryGT).get(`hubs/general/organizations/${orgId}/assets`)
    .then(r => {
      expect(r.body).to.not.be.null;
      return r;
    });
  });
  options4.qs = {};
  options4.qs.pageSize = 1;
  it('should support cursor pagination for sections/assets', () => {
    return cloud.withOptions(options4).get(`hubs/general/sections/${sectionId}/assets`)
      .then(r => {
        expect(r.body).to.not.be.null;
        options4.qs.nextPage = r.response.headers['elements-next-page-token'];
        return cloud.withOptions(options4).get(`hubs/general/sections/${sectionId}/assets`);
      });
  });
  it('should support = CEQL search for sections/assets', () => {
    return cloud.withOptions(whereQuery).get(`hubs/general/sections/${sectionId}/assets`)
      .then(r => {
        expect(r.body).to.not.be.null;
        return r;
      });
  });
  it('should support >= CEQL search for sections/assets', () => {
    return cloud.withOptions(whereQueryGT).get(`hubs/general/sections/${sectionId}/assets`)
    .then(r => {
      expect(r.body).to.not.be.null;
      return r;
    });
  });
  after(() => cloud.delete(`${test.api}/${assetId}`));
});
