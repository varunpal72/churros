'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/placments.json`);
const updatePayload = {};


suite.forElement('crm', 'placements', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
