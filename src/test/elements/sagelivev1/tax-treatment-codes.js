'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const taxCodesPayload = tools.requirePayload(`${__dirname}/assets/tax-codes.json`);
const taxTreatmentsPayload = tools.requirePayload(`${__dirname}/assets/tax-treatments.json`);
const templatesPayload = tools.requirePayload(`${__dirname}/assets/templates.json`);
const taxTreatmentCodesPayload = tools.requirePayload(`${__dirname}/assets/tax-treatment-codes.json`);

suite.forElement('finance', 'tax-treatment-codes', { payload: taxTreatmentCodesPayload }, (test) => {
  let id1, id2, id3;
  before(() => cloud.post(`/hubs/finance/tax-codes`, taxCodesPayload)
    .then(r => {
      taxTreatmentCodesPayload.TaxCode = r.body.id;
      id1 = r.body.id;
    })
    .then(r => cloud.post(`/hubs/finance/tax-treatments`, taxTreatmentsPayload))
    .then(r => {
      taxTreatmentCodesPayload.TaxTreatment = r.body.id;
      id2 = r.body.id;
    })
    .then(r => cloud.post(`/hubs/finance/templates`, templatesPayload))
    .then(r => {
      taxTreatmentCodesPayload.Template = r.body.id;
      id3 = r.body.id;
    }));
  test.should.supportCruds();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by Name`)
    .withOptions({ qs: { where: `Name  ='Test'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Name === `Test}`);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
  after(() => cloud.delete(`/hubs/finance/tax-codes/${id1}`)
    .then(r => cloud.delete(`/hubs/finance/tax-treatments/${id2}`))
    .then(r => cloud.delete(`/hubs/finance/templates/${id3}`)));
});
