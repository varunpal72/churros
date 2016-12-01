'use strict';

const suite = require('core/suite');
const chakram = require('chakram');
const payload = require('./assets/accounts');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const accountsPayload = build({ visible_to: tools.randomInt(), name: tools.random() });

suite.forElement('crm', 'accounts', { payload: accountsPayload, skip: false }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "name": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds(chakram.put);
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'name = \'Robot Account 1\'' } }).should.return200OnGet();
});
