'use strict';

const suite = require('core/suite');
const payload = require('./assets/campaigns');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const contactsPayload = build({ Description: tools.random() });

suite.forElement('crm', 'campaigns', { payload: contactsPayload }, (test) => {
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
