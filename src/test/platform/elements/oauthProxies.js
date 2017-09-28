'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/oauthProxy');

suite.forPlatform('elements/oauthProxies', (test) => {
  let oauthId;
  before(() => cloud.post('elements/oauthProxies', payload)
  .then(r => oauthId = r.body.id));

  it('should support creating and searching oauth proxies', () => {
    return cloud.get('elements/oauthProxies');
  });
  it('should support creating applicationurl on oauth proxy', () => {
    return cloud.withOptions({ qs: { applicationUrl: 'test**.com' } }).post(`elements/oauthProxies/${oauthId}/applicationUrl`,{});
  });
  after(() => cloud.withOptions({qs:{applicationUrl:'test**.com'}}).delete(`elements/oauthProxies/${oauthId}/applicationUrl`));
  after(() => cloud.delete(`elements/oauthProxies/${oauthId}`));
});
