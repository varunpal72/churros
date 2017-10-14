'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/posting-rule-dimensions');
const update = tools.requirePayload(`${__dirname}/assets/updateUid.json`);
const prePayload = tools.requirePayload(`${__dirname}/assets/posting-rules.json`);

suite.forElement('finance', 'posting-rule-dimensions', { payload: payload }, (test) => {
  let id;
  const options = {
    churros: {
      updatePayload: update
    }
  };
  before(() => cloud.post(`/hubs/finance/posting-rules`, prePayload)
    .then(r => {
      id = r.body.id;
      payload.PostingRule = r.body.id;
    }));
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by Name`)
    .withOptions({ qs: { where: `Name  ='test'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Name === 'test');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
  after(() => cloud.delete(`/hubs/finance/posting-rules/${id}`));
});
