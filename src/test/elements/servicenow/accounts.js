'use strict';

const suite = require('core/suite');
const payload = require('./assets/accounts');

const options = {
  churros: {
    updatePayload: {
      "visibility": "pub",
      "default_from_email": "ze-churros@cloud-elements.com",
      "use_awesomebar": true,
      "name": "Churros update the list",
      "permission_reminder": "Because churros"
    }
  }
};

suite.forElement('helpdesk', 'accounts', { payload: payload }, (test) => {
  test.should.supportPagination();
  test.withOptions(options).should.supportCruds();
  test.withName('should allow >= Ceql search').withOptions({ qs: { where: 'sys_created_on>=\'2008-05-24T01:14:22\'' } }).should.return200OnGet();
});
