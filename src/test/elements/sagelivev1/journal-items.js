'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const journalItemPayload = tools.requirePayload(`${__dirname}/assets/journal-items.json`);
const update = tools.requirePayload(`${__dirname}/assets/updatePayload.json`);

suite.forElement('finance', 'journal-items', { payload: journalItemPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: update
    }
  };
  before(() => cloud.get(`/hubs/finance/journal-types`)
      .then(r =>   journalItemPayload.JournalType = r.body[0].id));
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
});
