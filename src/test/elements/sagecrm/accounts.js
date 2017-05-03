'use strict';

const suite = require('core/suite');
const payload = require('./assets/accounts');
const tools = require('core/tools');
const chakram = require('chakram');
const build = (overrides) => Object.assign({}, payload, overrides);
const accountPayload = build({ comp_name: tools.random()});

suite.forElement('crm', 'accounts', { payload: accountPayload }, (test) => {
 const options = {
    churros: {
      updatePayload: {
	"comp_name": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.withOptions(options).should.supportCruds(chakram.put);  
  test.should.supportPagination();
  test.should.supportCeqlSearch('Comp_CompanyId');  
  test.withName(`should support searching ${test.api} by company Name`).withOptions({ qs: { where: `Comp_Name ='Test'` } }).should.return200OnGet();        
});
