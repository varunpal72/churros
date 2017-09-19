'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const cloud = require('core/cloud');
const payload = require('./assets/ledger-entries');

suite.forElement('finance', 'ledger-entries', { payload: payload, skip: true }, (test) => { //payload issue
  before(() => cloud.get(`/hubs/finance/companies`)
    .then(r => payload.Company = r.body.id));
  test.should.supportCruds();
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
