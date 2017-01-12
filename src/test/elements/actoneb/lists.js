'use strict';

const suite = require('core/suite');
const payload = require('./assets/lists');
const cloud = require('core/cloud');

suite.forElement('marketing', 'lists', { payload: payload }, (test) => {
  test.should.supportCrds();
  it('it should support GET /hubs/marketing/lists/hardbounce', () => {
    return cloud.get(`${test.api}/hardbounce`);
  });
});
