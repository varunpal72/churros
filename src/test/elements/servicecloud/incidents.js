'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/incidents');

suite.forElement('helpdesk', 'incidents', { payload: payload }, (test) => {
  const updatePayload = {
    "subject": tools.random()
  };

  test.withOptions({ churros: { updatePayload: updatePayload } }).should.supportCruds();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'createdTime = `2014-03-18T13:39:05+0000`' } }).should.return200OnGet();

});
