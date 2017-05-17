'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const cloud = require('core/cloud');

suite.forElement('finance', 'live-exchange-rates', (test) => {
  let id;
  it(`should allow SR for ${test.api}`, () => {
    return cloud.get(test.api)
      .then(r => {
        id = r.body[0].currency.id;
      })
      .then(r => cloud.get(`${test.api}/${id}`));
  });
  //where clause not working
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by show_legacy_id`)
    .withOptions({ qs: { show_legacy_id: `true` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
    }).should.return200OnGet();
});
