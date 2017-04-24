'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
suite.forElement('ecommerce', 'stores-configs', (test) => {
  test
   .withName(`should support searching  ${test.api} by storeCodes`)
   .withOptions({ qs: { where: `storeCodes = 'default'`} })
   .withValidation((r) => {
   expect(r).to.have.statusCode(200);
   const validValues = (r.body.filter(obj => obj.code === 'default'));
   expect(validValues.length).to.equal(r.body.length);
   }).should.return200OnGet();
  test.withApi('/hubs/ecommerce/stores').should.return200OnGet();
  test.withApi('/hubs/ecommerce/stores-groups').should.return200OnGet();
  test.withApi('/hubs/ecommerce/stores-websites').should.return200OnGet();
    test.should.supportPagination();
});
