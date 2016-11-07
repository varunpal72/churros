'use strict';

const suite = require('core/suite');
const payload = require('./assets/statuses');
const tools = require('core/tools');
const cloud = require('core/cloud');
const build = (overrides) => Object.assign({}, payload, overrides);
const tweetsPayload = build({ status: tools.random() });

suite.forElement('social', 'statuses', { payload: tweetsPayload }, (test) => {
  it('should create and get a statuses and then patch for variant', () => {
    let tweetId;
    return cloud.post(test.api, tweetsPayload)
      .then(r => tweetId = r.body.id_str)
      .then(r => cloud.get(`${test.api}/${tweetId}`), null)
      .then(r => cloud.delete(`${test.api}/${tweetId}`), null);
  });
});
