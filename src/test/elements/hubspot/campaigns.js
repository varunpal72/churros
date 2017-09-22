'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const chakram = require('chakram');
const expect = chakram.expect;

suite.forElement('marketing', 'campaigns', (test) => {
  let hubspotAppId, campaignId;
  before(() => {
    return cloud.withOptions({ qs: { pageSize: 1 } }).get(test.api)
      .then(r => {
        if (r.body.length) {
          let bodyObject = r.body[0];
          hubspotAppId = bodyObject.appId;
          campaignId = bodyObject.id;
        }
      });
  });

  it(`should allow SR for ${test.api}`, () => {
    let id;
    return cloud.get(test.api)
      .then(r => {
        if (r.body.length) {
          id = r.body[0].id;
          cloud.get(`${test.api}/${id}`);
        }
      });
  });

  it('should allow paginating with page and nextPage /hubs/marketing/campaigns', () => {
    const options = { qs: { pageSize: 1 } };
    return cloud.get(test.api)
      .then(r => {
        expect(r.body.length).to.be.at.least(0);
        options.qs.nextPage = r.response.headers['elements-next-page-token'];
        return cloud.withOptions(options).get(test.api, (r) => expect(r.body.length).to.be.at.least(0));
      });
  });

  it(`should allow cursor pagination for ${test.api}/{id}/activities`, () => {
    if (hubspotAppId) {
      const options = { qs: { pageSize: 1, where: `appId='${hubspotAppId}'` } };
      return cloud.withOptions(options).get(`${test.api}/${campaignId}/activities`)
        .then(r => {
          expect(r.body.length).to.be.at.least(0);
          options.qs.nextPage = r.response.headers['elements-next-page-token'];
          return cloud.withOptions(options).get(`${test.api}/${campaignId}/activities`, (r) => expect(r.body.length).to.be.at.least(0));
        });
    }
  });
  it(`should allow Sr for ${test.api}/{id}/activities`, () => {
    if (hubspotAppId) {
      const options = { qs: { where: `appId='${hubspotAppId}'` } };
      let bodyObject;
      return cloud.withOptions(options).get(`${test.api}/${campaignId}/activities`)
        .then(r => bodyObject = r.body[0])
        .then(() => {
          options.qs.created = bodyObject.created;
        })
        .then(r => cloud.withOptions(options).get(`${test.api}/${campaignId}/activities/${bodyObject.id}`));
    }
  });
});
