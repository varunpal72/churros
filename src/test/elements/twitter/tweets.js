'use strict';

const suite = require('core/suite');
const payload = require('./assets/tweets');
const tools = require('core/tools');
const cloud = require('core/cloud');
const build = (overrides) => Object.assign({}, payload, overrides);
const tweetsPayload = build({ status: tools.random() });

suite.forElement('social', 'tweets', { payload: tweetsPayload }, (test) => {
  test.withOptions({ qs: { where: 'q = \'Jurgen Klopp\'', page: 1, pageSize: 1 } }).should.return200OnGet();
  it('should create and get a tweet and then patch for variant', () => {
    let tweetId;
    return cloud.post(test.api, tweetsPayload)
      .then(r => tweetId = r.body.id_str)
      .then(r => cloud.get(`${test.api}/${tweetId}`), null)
      .then(r => cloud.delete(`${test.api}/${tweetId}`), null);
  });

});
