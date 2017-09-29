'use strict';

//dependencies at the top
const suite = require('core/suite');
//best way to only import one payload
const payload = require('core/tools').requirePayload(`${__dirname}/assets/campaigns.json`);

suite.forElement('crm', 'campaigns', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportCeqlSearch('id');//search campaigns by 'id'
  test.should.supportPagination();
  test.should.return404OnGet('0');//should not find campaign wit id '0'
});
