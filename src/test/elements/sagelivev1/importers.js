'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const importersPayload = tools.requirePayload(`${__dirname}/assets/importers.json`);
const pre1Payload = tools.requirePayload(`${__dirname}/assets/dimensions.json`);
const prePayload = tools.requirePayload(`${__dirname}/assets/jobs.json`);
const update = tools.requirePayload(`${__dirname}/assets/updatePayload.json`);

suite.forElement('finance', 'importers', { payload: importersPayload, skip: true }, (test) => {
  let id, id1, j, k, i;
  const options = {
    churros: {
      updatePayload: update
    }
  };
  i = (Math.floor(Math.random() * (12 - 1 + 1)) + 1);
  j = i + 1;
  k = j + 1;
  prePayload.CRONExpression = " " + j + " " + i + " " + k + " L * ?";
  before(() => cloud.post(`/hubs/finance/jobs`, prePayload)
    .then(r => {
      id = r.body.id;
      importersPayload.Job = id;
    })
    .then(r => cloud.post(`/hubs/finance/dimensions`, pre1Payload))
    .then(r => {
      id1 = r.body.id;
      importersPayload.Dimension = id1;
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
  after(() => cloud.delete(`/hubs/finance/dimensions/${id1}`)
    .then(r => cloud.delete(`/hubs/finance/jobs/${id}`)));
});
