'use strict';

const suite = require('core/suite');
const payload = require('./assets/vendor');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const vendor = build({ familyName: tools.random(), givenName: tools.random(), displayName: tools.random()});

suite.forElement('finance', 'vendor', { payload: vendor, skip: false}, (test) => {
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
