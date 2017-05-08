'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const  payload= require('./assets/journal-tags');
const build = (overrides) => Object.assign({}, payload, overrides);
const journalItemPayload = build({Name: "name" + tools.randomInt()});


suite.forElement('finance', 'journal-tags',{ payload:journalItemPayload } , (test) => {
  let name,id,updatedPayload;
  it('should support GET  Journal and Dimension', () => {
      cloud.get(`/hubs/finance/journals`)
        .then(r => journalItemPayload.Journal = r.body[0].id)
        .then(r =>  cloud.get(`/hubs/finance/dimensions`))
        .then(r => journalItemPayload.Dimension = r.body[0].id);
    });
    test.should.supportCrds();
    it('should support PATCH ${test.api}', () => {
      return cloud.get(test.api)
        .then(r => {id = r.body[0].id;
                    updatedPayload = {"Name": "ce"};  } )
        .then(r => cloud.patch(`${test.api}/${id}`, updatedPayload) );
      });
    test.should.supportPagination();
    it(`should support GET ${test.api}`, () => {
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
