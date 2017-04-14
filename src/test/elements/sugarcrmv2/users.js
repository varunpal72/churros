'use strict';

const suite = require('core/suite');
const payload = require('core/tools').requirePayload(`${__dirname}/assets/users.json`);


suite.forElement('crm', 'users', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
