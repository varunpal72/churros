'use strict';

const suite = require('core/suite');
const payload = require('./assets/users');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const usersPayload = build({ userName: tools.random() });

suite.forElement('helpdesk', 'users', { payload: usersPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "userName": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'clientPortalActive = \'True\'' } }).should.return200OnGet();
});
