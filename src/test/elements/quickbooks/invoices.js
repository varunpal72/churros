'use strict';

const suite = require('core/suite');
const payload = require('./assets/invoices');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const invoices = build({ docNumber: tools.random()});

suite.forElement('finance', 'invoices', { payload: invoices, skip: false}, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "docNumber": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.should.supportCeqlSearch('totalAmt');
});
