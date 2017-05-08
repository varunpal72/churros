'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const cloud = require('core/cloud');
const companyTagsPayload = require('./assets/default-company-tags');

suite.forElement('finance', 'default-company-tags',{ payload:companyTagsPayload } , (test) => {
  let name;
  it('should support GET Company and Dimension', () => {
    return  cloud.get(`/hubs/finance/companies`)
      .then(r => companyTagsPayload.Company = r.body[0].id)
      .then(r => cloud.get(`/hubs/finance/dimensions`))
      .then(r => companyTagsPayload.Dimension = r.body[0].id);
    });
  test.should.supportCruds();
  test.should.supportPagination();
  it('should support GET ${test.api}', () => {
    return cloud.get(test.api)
      .then(r => name = r.body[0].Name);
    });
  test
   .withName(`should support searching ${test.api} by Name`)
   .withOptions({ qs: { where:`Name  ='${name}'`} })
   .withValidation((r) => {
   expect(r).to.have.statusCode(200);
   const validValues = r.body.filter(obj => obj.Name === `${name}`);
   expect(validValues.length).to.equal(r.body.length);
 }).should.return200OnGet();
  });
