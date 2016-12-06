'use strict';

const suite = require('core/suite');
const chakram = require('chakram');
const payload = require('./assets/users');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const usersPayload = build({ name: tools.random(), email: tools.randomEmail() });

suite.forElement('crm', 'users', { payload: usersPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "active_flag": false
      },
      skip: true //API doesn't support a delete
    }
  };
  test.withOptions(options).should.supportCrus(chakram.put);
  test.should.supportPagination();
});