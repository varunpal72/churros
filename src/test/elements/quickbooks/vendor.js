'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/vendor.json`);

suite.forElement('finance', 'vendor', { payload: payload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "familyName": tools.random(),
        "givenName": tools.random(),
        "displayName": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
});
