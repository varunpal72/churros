'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = tools.requirePayload(`${__dirname}/assets/journal-entries.json`);

suite.forElement('finance', 'journal-entries', { payload: payload, skip: true }, (test) => {
  before(() => cloud.get(`/hubs/finance/companies`)
    .then(r => payload.Items.JournalCompany.Id = r.body.id)
    .then(r => cloud.get(`/hubs/finance/journal-types`))
    .then(r => payload.Items.JournalType.Id = r.body.id)
    .then(r => cloud.get(`/hubs/finance/currencies`))
    .then(r => payload.Items.JournalCurrency.Id = r.body.id));
  test.should.supportCruds();
  test
    .withName(`should support searching ${test.api} by Name`)
    .withOptions({ qs: { where: `Name  ='Test'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Name === `Test`);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
