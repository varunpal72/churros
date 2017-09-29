'use strict';

const suite = require('core/suite');
const chakram = require('chakram');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/campaigns.json`);

suite.forElement('general', 'campaigns', { payload: payload, skip: true }, (test) => {

  const options = {
    churros: {
      updatePayload: {
        "name": "Las Vegas Trip Money Building Campaign",
        "fromEmail": "stuartprice@hangover.com",
        "fromName": "Stuart Price",
        "forwardToFriend": 3,
        "clickTrackMode": 1,
        "subscriptionManagement": 1,
        "useAccountAddress": 1,
        "archiveByDefault": 1,
        "description": "He is funny because he is fat !"
      }
    }
  };
  test.withOptions(options).should.supportCrus(chakram.put);
  test.should.supportPagination();
});
