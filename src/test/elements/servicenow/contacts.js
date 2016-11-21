'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');

const options = {
  churros: {
    updatePayload: {
      "manager": "",
      "location": "",
      "street": "123 Update Street",
      "city": "Denver",
      "web_service_access_only": "false",
      "vip": "false",
      "first_name": "Claude-UPDATE",
      "middle_name": "P.",
      "country": "US",
      "user_name": "claude.elements",
      "email": "claude@cloud-elements.com",
      "roles": "",
      "last_name": "Elements-UPDATE",
      "active": "true",
      "state": "CO",
      "zip": "80203"
    }
  }
};

suite.forElement('helpdesk', 'contacts', { payload: payload, skip: true }, (test) => {
  test.should.supportPagination();
  test.withOptions(options).should.supportCruds();
  test.withOptions({ qs: { where: 'sys_created_on>=\'2012-02-18T03:04:53\'' } }).should.return200OnGet();
});
