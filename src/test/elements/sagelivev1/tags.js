'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const tagsPayload = tools.requirePayload(`${__dirname}/assets/tags.json`);
const dimensionsPayload = tools.requirePayload(`${__dirname}/assets/dimensions.json`);

suite.forElement('finance', 'tags', { payload: tagsPayload }, (test) => {
  let id;
  before(() => cloud.get(`/hubs/finance/companies`)
    .then(r => tagsPayload.Company = r.body[0].id)
    .then(r => cloud.post(`/hubs/finance/dimensions`, dimensionsPayload))
    .then(r => {
      id = r.body.id;
      tagsPayload.Dimension = r.body.id;
    }));
  test.should.supportCruds();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by Name`)
    .withOptions({ qs: { where: `Name  ='Test'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Name === `Test`);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
  after(() => cloud.delete(`/hubs/finance/dimensions/${id}`));
});
