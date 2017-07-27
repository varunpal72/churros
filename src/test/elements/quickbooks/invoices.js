'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/invoices.json`);


suite.forElement('finance', 'invoices', { payload: payload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "docNumber": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.withOptions({ qs: { where: 'totalAmt = \'1\'', page: 1, pageSize: 1 } }).should.return200OnGet();
});
