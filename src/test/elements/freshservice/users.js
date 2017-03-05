'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = {
  "name": "Super Man",
  "email": tools.randomEmail(),
  "department_users_attributes": {
    "department_id": "2,3"
  }
};
suite.forElement('helpdesk', 'users', { payload: payload }, (test) => {
  test.withOptions({ qs: { page: 1 } }).should.return200OnGet();
  test.should.supportCruds();
});
