'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/users.json`);

const options = {
  churros: {
    updatePayload: {
      "username": "Userguy2",
      "email": tools.randomEmail()
    }
  }
};


suite.forElement('helpdesk', 'users', { payload }, (test) => {
  test.should.supportPagination();
  test.withOptions(options).should.supportCruds();
});
