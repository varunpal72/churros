'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const cloud = require('core/cloud');
const payload = require('./assets/workflows');

suite.forElement('marketing', 'workflows', { payload: payload }, (test) => {
  test.should.supportCrds();
  it('should allow paginating/hubs/marketing/workflows', () => {
    const options = { qs: { pageSize: 1 } };
    return cloud.get(test.api)
      .then(r => {
        expect(r.body.length).to.be.at.least(0);
        options.qs.nextPage = r.response.headers['elements-next-page-token'];
        return cloud.withOptions(options).get(test.api, (r) => expect(r.body.length).to.be.at.least(0));
      });
  });
});
