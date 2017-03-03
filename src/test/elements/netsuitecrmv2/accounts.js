'use strict';

const suite = require('core/suite');
const payload = require('./assets/accounts');

//`custom.long.scriptId` = 'custentity_cust_priority' and `custom.long.value` = 50
//`custom.multi.scriptId` = 'custentity1' and `custom.multi.value.internalId` = 1
//`custom.boolean.scriptId` = 'custentity_2663_direct_debit' and `custom.boolean.value` = 'false'

suite.forElement('crm', 'accounts', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1,
                           pageSize: 5,
                           where : "`custom.multi.scriptId` = 'custentity1' and `custom.multi.value.internalId` = 1"
                         } }).should.return200OnGet();
  test.should.supportCeqlSearch('id');
});
