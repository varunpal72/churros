'use strict';

const suite = require('core/suite');
const payload = require('./assets/users');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const usersPayload = build({ name: tools.random(), login: tools.randomEmail() });

suite.forElement('documents', 'users', { payload: usersPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "name": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'status = \'active\'' } }).should.return200OnGet();
});
