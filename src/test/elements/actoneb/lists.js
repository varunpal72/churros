'use strict';

const suite = require('core/suite');
const payload = require('./assets/lists');
const cloud = require('core/cloud');
const tools = require('core/tools');

suite.forElement('marketing', 'lists', { payload: payload }, (test) => {
  test.should.supportCrds();
  it('should support GET /hubs/marketing/lists/hardbounce', () => {
    return cloud.get(`${test.api}/hardbounce`);
  });

  it('should sleep for 60 seconds to avoid rate limits', () => {
    return tools.sleep(60);
  });
});