'use strict';

const suite = require('core/suite');
const settingsPayload = require('./assets/settings');
const profilesPayload = require('./assets/profiles');
const tools = require('core/tools');
const cloud = require('core/cloud');
const build = (overrides) => Object.assign({}, profilesPayload, overrides);
const putProfilesPayload = build({ "description": tools.random() });

suite.forElement('social', 'accounts', { payload: putProfilesPayload }, (test) => {
  test.withApi(test.api + '/settings').should.return200OnGet();
  it('should support GET/PUT for account profile and account settings', () => {
    return cloud.put(`${test.api}/profile`, putProfilesPayload)
      .then(cloud.put(`${test.api}/settings`, settingsPayload));
  });
});
