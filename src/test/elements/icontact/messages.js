'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const chakram = require('chakram');
const payload = tools.requirePayload(`${__dirname}/assets/messages.json`);

suite.forElement('general', 'messages', { payload: payload, skip: true }, (test) => {
  const options = {
    churros: {
      updatePayload: { "subject": "Bonjour!" }
    }
  };
  it('should allow CR for hubs/general/campaigns', () => {
    let campaignId;
    return cloud.get('hubs/general/campaigns')
      .then(r => {
        if (r.body && r.body.length > 0) {
          campaignId = r.body[0].id;
        } else {
          let campaignPayload = tools.requirePayload(`${__dirname}/assets/campaigns.json`);
          cloud.post(`${test.api}`, campaignPayload);
          campaignId = r.body.id;
        }
        payload.campaignId = campaignId;
      });
  });
  test.withOptions(options).should.supportCrus(chakram.put);
  test.should.supportPagination();
});
