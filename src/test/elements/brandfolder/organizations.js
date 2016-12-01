'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const chakram = require('chakram');
const expect = chakram.expect;

const updatePayload = () => ({
  "type": "organizations",
  "attributes": {
    "name": "Demo Sandbox"
  }
});

suite.forElement('general', 'organizations', { skip: true }, (test) => {
  it('should support RUS and sub-resources', () => {
    let orgId = -1;
    return cloud.get(test.api)
      .then(r => orgId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${orgId}`))
      .then(r => cloud.patch(`${test.api}/${orgId}`, updatePayload()))
      .then(r => cloud.get(`${test.api}/${orgId}/assets`))
      .then(r => cloud.get(`${test.api}/${orgId}/brandfolders`));
  });
  it('should support cursor pagination', () => {
    const options = { qs: { pageSize: 1}};
    return cloud.withOptions(options).get(test.api)
      .then(r => {
        expect(r.body).to.not.be.null;
        options.qs.nextPage = r.response.headers['elements-next-page-token'];
        return cloud.withOptions(options).get(test.api);
      });
  });
});
