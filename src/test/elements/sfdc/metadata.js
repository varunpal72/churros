'use strict';

//dependencies at the top
const suite = require('core/suite');
const expect = require('chakram').expect;

suite.forElement('crm', 'metadata', (test) => {

  //variables multiple tests will use
  const uri = '/hubs/crm/objects/contact/metadata';

  test
  .withApi('/hubs/crm/objects')//using specified api
  .withValidation(r => expect(r.body).to.include('Account'))//validating the response is what we expect
  .withName('should test objects api')//changes the name of the test
  .should.return200OnGet();

  const metaValid = r => {
    let metadata = r.body.fields[0];
    expect(metadata.filterable).to.exist;
    expect(metadata.createable).to.exist;
    expect(metadata.updateable).to.exist;
  };
  test
  .withApi(uri)//using specified api
  .withValidation(metaValid)//passing a function to validate response
  .withName('should include filterable, createable, and updateable for metadata')//changes the name of the test
  .should.return200OnGet();

  const validateSalutation = (r) => {
    let isPicklist = false;
    r.body.fields.forEach(field => isPicklist = (field.vendorPath === 'Salutation' && field.vendorNativeType === 'picklist' && expect(field).to.contain.key('picklistValues')));
    return isPicklist;
  };
  //can be written in one line
  test.withApi(uri).withValidation(validateSalutation).withName('should include picklist for contact metadata').should.return200OnGet();
});
