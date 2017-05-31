'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/campaigns.json`);

suite.forElement('crm', 'campaigns', { payload: payload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "Campaign Name": tools.random(),
        "Description": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearchForMultipleRecords('Description');
});
