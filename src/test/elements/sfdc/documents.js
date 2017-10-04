'use strict';

//dependencies at the top
const suite = require('core/suite');
const expect = require('chakram').expect;

suite.forElement('crm', 'Document', (test) => {
  test
  .withApi(`${test.api}/0150H00000FRylLQAT/data`)//calls specified api
  .withValidation(r => expect(r.body).to.not.be.empty)//runs this function on the response from the endpoint
  .withName('should allow GET /{objectName}/{objectId}/data for a Document object')//changes the name of the test
  .should.return200OnGet();
});
