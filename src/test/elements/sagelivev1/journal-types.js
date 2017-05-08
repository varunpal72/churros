'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

 suite.forElement('ecommerce', 'journal-types', (test) => {
   let name;
     test.should.supportSr();
     it('should support GET ${test.api}', () => {
       return cloud.get(test.api)
         .then(r => name = r.body[0].Name);
       });
        test
         .withName(`should support searching ${test.api} by Name`)
         .withOptions({ qs: { where:`Name='${name}'`} })
         .withValidation((r) => {
         expect(r).to.have.statusCode(200);
         const validValues = r.body.filter(obj => obj.Name === '${name}');
         expect(validValues.length).to.equal(r.body.length);
       }).should.return200OnGet();
         test.should.supportPagination();
   });
