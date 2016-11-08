'use strict';

const suite = require('core/suite');
const payload = require('./assets/users');

const options = {
  churros: {
    updatePayload: {
      "username": "Userguy2",
      "email": "userguy2@cloud-elements.com"
    }
  }
};

suite.forElement('helpdesk', 'users', { payload }, (test) => {
  test.should.supportPagination();
  test.withOptions(options).should.supportCruds();
});
