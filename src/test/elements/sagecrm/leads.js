'use strict';

const suite = require('core/suite');
const payload = require('./assets/leads');
const tools = require('core/tools');
const chakram = require('chakram');
const build = (overrides) => Object.assign({}, payload, overrides);
const leadPayload = build({ lead_personfirstname: tools.random(),lead_personlastname:tools.random()});

suite.forElement('crm', 'leads', { payload: leadPayload }, (test) => {
 const options = {
    churros: {
      updatePayload: {
	"lead_personfirstname": tools.random()
      }
    }
  };
    test.withOptions(options).should.supportCruds();
 test.withOptions(options).should.supportCruds(chakram.put);  
    test.should.supportPagination();
    test.should.supportCeqlSearch('Lead_LeadId');  
    test.withName(`should support searching ${test.api} by lead status`).withOptions({ qs: { where: `lead_status ='In Progress'` } }).should.return200OnGet();    
});
