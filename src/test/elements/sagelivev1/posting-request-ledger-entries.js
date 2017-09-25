'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const cloud = require('core/cloud');
const payload = require('./assets/posting-request-ledger-entries');

suite.forElement('finance', 'posting-request-ledger-entries', { payload: payload }, (test) => {
  before(() => cloud.get(`/hubs/finance/posting-requests`)
    .then(r => payload.PostingRequest = r.body[0].id));
  test.should.supportCrds(); // Update not possible as Error: Please check the security settings of this field and verify that it is read/write for your profile or permission set.\",\"errorCode\":\"INVALID_FIELD_FOR_INSERT_UPDATE
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by Name`)
    .withOptions({ qs: { where: `Name  ='test'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Name === 'test');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
