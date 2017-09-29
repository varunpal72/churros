'use strict';

const suite = require('core/suite');
const payload = require('./assets/payments');
const chakram = require('chakram');
const expect = chakram.expect;

//Need to skip as there is no delete API
suite.forElement('finance', 'payments', { payload: payload ,skip: true }, (test) => {
  test.should.supportCrus();
  test.withOptions({ qs: { page: 1, pageSize: 1 } }).should.return200OnGet();
  test.withName(`should support searching ${test.api} by Id`)
    .withOptions({ qs: { where: `id ='1234'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.id = '1234');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();

});
