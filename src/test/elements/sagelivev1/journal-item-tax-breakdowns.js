'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const cloud = require('core/cloud');
const  journalItemTaxPayload= require('./assets/journal-item-tax-breakdowns');


suite.forElement('finance', 'journal-item-tax-breakdowns',{ payload:journalItemTaxPayload } , (test) => {
  let name,id,updatedPayload;
  it('should support GET journal-items', () => {
    return cloud.get(`/hubs/finance/journal-items`)
      .then(r => journalItemTaxPayload.JournalItem = r.body[0].id);
    });
    test.should.supportCrds();
    it(`should support PATCH ${test.api}`, () => {
      return cloud.get(test.api)
        .then(r => {id = r.body[0].id;
                    updatedPayload = {"attributes":{"type": "updated type"}};  } )
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
