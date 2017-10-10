'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/related-tags.json`);
const tagsPayload = tools.requirePayload(`${__dirname}/assets/tags.json`);
const dimensionsPayload = tools.requirePayload(`${__dirname}/assets/dimensions.json`);
const update = tools.requirePayload(`${__dirname}/assets/updateUid.json`);

suite.forElement('finance', 'related-tags', { payload: payload }, (test) => {
  let id1, id2;
  const options = {
    churros: {
      updatePayload: update
    }
  };
  before(() => cloud.post(`/hubs/finance/dimensions`, dimensionsPayload)
    .then(r => {
      id1 = r.body.id;
      payload.Dimension = r.body.id;
    })
    .then(r => cloud.get(`/hubs/finance/companies`))
    .then(r => tagsPayload.Company = r.body[0].id)
    .then(r => cloud.post(`/hubs/finance/tags`, tagsPayload))
    .then(r => {
      payload.Tag = r.body.id;
      id2 = r.body.id;
    }));
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by Name`)
    .withOptions({ qs: { where: `Name  ='Test'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Name === `Test`);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
    after(() => cloud.delete(`/hubs/finance/dimensions/${id1}`)
      .then(r => cloud.delete(`/hubs/finance/tags/${id2}`)));
  });
