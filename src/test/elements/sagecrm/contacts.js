'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const tools = require('core/tools');
const chakram = require('chakram');
const build = (overrides) => Object.assign({}, payload, overrides);
const contactPayload = build({ Pers_LastName: tools.random(),Pers_FirstName:tools.random(),Pers_Title:tools.random()});

suite.forElement('crm', 'contacts', { payload: contactPayload }, (test) => {
 const options = {
    churros: {
      updatePayload: {
       "Pers_LastName": tools.random()
      }
    }
  };
    test.withOptions(options).should.supportCruds();
    test.withOptions(options).should.supportCruds(chakram.put);  
    test.should.supportPagination();
    test.should.supportCeqlSearch('Pers_PersonId');  
    test.withName(`should support searching ${test.api} by contact first name`).withOptions({ qs: { where: `Pers_FirstName ='Test'` } }).should.return200OnGet();        

});
