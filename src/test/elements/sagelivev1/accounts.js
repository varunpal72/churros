'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/accounts');
const build = (overrides) => Object.assign({}, payload, overrides);
const accountsPayload = build({ Name: "name" + tools.randomInt(),AccountNumber: "account" + tools.randomInt(),Emailaddress: "email" + tools.randomInt()+ "@gmail.com",Website: "https://mail" + tools.randomInt() +".com",Site: "https://site" + tools.randomInt() +".com"});

suite.forElement('finance', 'accounts',{ payload: accountsPayload } , (test) => {
  let name,reference;
  it('should support GET ${test.api}', () => {
    return cloud.get(test.api)
      .then(r =>{ name = r.body[0].Name;
                  reference= "ref" + tools.randomInt();
                  accountsPayload.attributes.reference = reference;
      });
    });
  test.should.supportCruds();
  test.should.supportPagination();
  test
   .withName(`should support searching ${test.api} by Name`)
   .withOptions({ qs: { where:`Name  ='${name}'`} })
   .withValidation((r) => {
   expect(r).to.have.statusCode(200);
   const validValues = r.body.filter(obj => obj.Name === `${name}`);
   expect(validValues.length).to.equal(r.body.length);
  }).should.return200OnGet();
  });
