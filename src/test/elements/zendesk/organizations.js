'use strict';

const suite = require('core/suite');
const payload = require('./assets/organizations');
const options = { payload: payload };

suite.forElement('helpdesk', 'organizations', options, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
