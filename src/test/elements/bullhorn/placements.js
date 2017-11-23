'use strict';

const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/placments.json`);
const updatePayload = {};


suite.forElement('crm', 'placements', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
