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
        let bodyObject = r.body[0];
        hubspotAppId = bodyObject.appId;
        campaignId = bodyObject.id;
      });
  });
  test.should.supportSr();
  test.should.supportNextPagePagination(2);
  
  it(`should allow cursor pagination for ${test.api}/{id}/activities`, () => {
    const options = { qs: { pageSize: 1, where: `appId='${hubspotAppId}'`} };
    return cloud.withOptions(options).get(`${test.api}/${campaignId}/activities`)
      .then(r => {
        expect(r.body).to.not.be.null;
        options.qs.nextPage = r.response.headers['elements-next-page-token'];
        return cloud.withOptions(options).get(`${test.api}/${campaignId}/activities`, (r) => expect(r.body).to.not.be.null);
      });
  });
  it(`should allow Sr for ${test.api}/{id}/activities`, () => {
    const options = { qs: { where: `appId='${hubspotAppId}'`} };
    let bodyObject;
    return cloud.withOptions(options).get(`${test.api}/${campaignId}/activities`)
      .then(r => bodyObject = r.body[0])
      .then(() => {
        options.qs.created = bodyObject.created;
      })
      .then(r => cloud.withOptions(options).get(`${test.api}/${campaignId}/activities/${bodyObject.id}`));
    });
});
