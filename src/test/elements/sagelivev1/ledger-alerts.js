'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const ledgerAlertsPayload= require('./assets/ledger-alerts');
const prePayload = tools.requirePayload(`${__dirname}/assets/dimensions.json`);
const update = tools.requirePayload(`${__dirname}/assets/updatePayload.json`);

suite.forElement('finance', 'ledger-alerts',{ payload:ledgerAlertsPayload } , (test) => {
  let id;
  const options = {
    churros: {
      updatePayload: update
    }
  };
  before(() => cloud.post(`/hubs/finance/dimensions`, prePayload)
      .then(r => {
        id = r.body.id;
        ledgerAlertsPayload.Dimension = id;
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
    after(() =>cloud.delete(`/hubs/finance/dimensions/${id}`));
});
