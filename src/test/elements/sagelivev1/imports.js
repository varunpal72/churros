'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const cloud = require('core/cloud');
const importsPayload = require('./assets/imports');

suite.forElement('finance', 'imports',{ payload:importsPayload } , (test) => {

    before(() =>  cloud.get(`/hubs/finance/companies`)
      .then(r => importsPayload.Company = r.body[0].id));
    test.should.supportCruds();
    test.should.supportPagination();
    test
      .withName(`should support searching ${test.api} by Name`)
      .withOptions({ qs: { where: `Name  ='test'` } })
      .withValidation((r) => {
        expect(r).to.have.statusCode(200);
        const validValues = r.body.filter(obj => obj.Name === 'test');
        expect(validValues.length).to.equal(r.body.length);
      }).should.return200OnGet();
  });
