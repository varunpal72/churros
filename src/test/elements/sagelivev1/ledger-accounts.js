'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;

 suite.forElement('finance', 'ledger-accounts', (test) => {
     test.should.supportSr();
     test
       .withName(`should support searching ${test.api} by Name`)
       .withOptions({ qs: { where: `Name  ='test'` } })
       .withValidation((r) => {
         expect(r).to.have.statusCode(200);
         const validValues = r.body.filter(obj => obj.Name === 'test');
         expect(validValues.length).to.equal(r.body.length);
       }).should.return200OnGet();
         test.should.supportPagination();
   });
