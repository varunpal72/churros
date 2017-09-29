'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const cloud = require('core/cloud');
const tools = require('core/tools');
const  journalItemTaxPayload= require('./assets/journal-item-tax-breakdowns');
const prePayload = tools.requirePayload(`${__dirname}/assets/journal-items.json`);
const update = tools.requirePayload(`${__dirname}/assets/updateUid.json`);

suite.forElement('finance', 'journal-item-tax-breakdowns',{ payload:journalItemTaxPayload } , (test) => {
    let id;
    const options = {
      churros: {
        updatePayload: update
      }
    };
      before(() =>  cloud.post(`/hubs/finance/journal-items`, prePayload)
        .then(r =>{
          journalItemTaxPayload.JournalItem = r.body.id;
         id =  r.body.id ;
        }));
    test.withOptions(options).should.supportCruds();
    test.should.supportPagination();
    test
      .withName(`should support searching ${test.api} by Name`)
      .withOptions({ qs: { where: `Name  ='test'` } })
      .withValidation((r) => {
        expect(r).to.have.statusCode(200);
        const validValues = r.body.filter(obj => obj.Name === 'test');
        expect(validValues.length).to.equal(r.body.length);
      }).should.return200OnGet();
    after(() => cloud.delete(`/hubs/finance/journal-items/${id}`));
  });
