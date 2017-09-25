'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/drafts.json`);

suite.forElement('erp', 'drafts', { payload: payload}, (test) => {
  test.should.supportCrds();
  test.should.supportPagination();
  test.should.supportCeqlSearch('Project');
});
