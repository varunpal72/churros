'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/other-payments');
const chakram = require('chakram');
const build = (overrides) => Object.assign({}, payload, overrides);
const otherpaymentsPayload = build({ reference: "re" + tools.randomInt(), date: Date() });

suite.forElement('finance', 'other-payments', { payload: otherpaymentsPayload }, (test) => {
  let id = "VENDOR_PAYMENT";
  test.should.supportCruds(chakram.put);
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by transaction_type_id`)
    .withOptions({ qs: { where: `transaction_type_id ='${id}'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.transaction_type.id === `${id}`);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
