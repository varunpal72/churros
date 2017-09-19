'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const cloud = require('core/cloud');
const payload = require('./assets/ledger-item-tags');

suite.forElement('finance', 'ledger-item-tags', { payload: payload }, (test) => { //You may not edit or delete tags on a ledger item if that item is not in draft state

  it.skip('should support GET  Dimension,Tags and LedgerEntry ', () => { // since CUD is not done, so skipping this prerequisite
    return cloud.get(`/hubs/finance/dimensions`)
      .then(r => payload.Dimension = r.body[0].id)
      .then(r => cloud.get(`/hubs/finance/tags`))
      .then(r => payload.Tag = r.body[0].id)
      .then(r => cloud.get(`/hubs/finance/ledger-items`))
      .then(r => payload.LedgerItem = r.body[0].id);
  });
  test.should.supportSr(); // UD not allowed, so C not performed.
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
