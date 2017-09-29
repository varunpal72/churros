'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const fieldAnalysesPayload = tools.requirePayload(`${__dirname}/assets/field-trip-field-analyses.json`);
const prePayload = tools.requirePayload(`${__dirname}/assets/field-trip-object-analyses.json`);
const update = tools.requirePayload(`${__dirname}/assets/updatePayload.json`);

suite.forElement('finance', 'field-trip-field-analyses', { payload: fieldAnalysesPayload }, (test) => {
  let id;
  const options = {
    churros: {
      updatePayload: update
    }
  };
  before(() => cloud.post(`/hubs/finance/field-trip-object-analyses`, prePayload)
    .then(r => {
      id = r.body.id;
      fieldAnalysesPayload.FieldTripObjectAnalysis = id;
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
  after(() => cloud.delete(`/hubs/finance/field-trip-object-analyses/${id}`));
});
