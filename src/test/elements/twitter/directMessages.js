'use strict';

const suite = require('core/suite');
const payload = require('./assets/directMessages');
const tools = require('core/tools');
const cloud = require('core/cloud');
const build = (overrides) => Object.assign({}, payload, overrides);
const dmPayload = build({ text: tools.random() });

suite.forElement('social', 'direct-messages', { payload: dmPayload }, (test) => {
  it('should support CRDS for direct-messages', () => {
    let dmId;
    return cloud.post(test.api, dmPayload)
      .then(r => dmId = r.body.id_str)
      .then(r => cloud.get(`${test.api}/${dmId}`))
      .then(r => cloud.get(`${test.api}/received-messages`), { qs: { page: 1, pageSize: 5 } })
      .then(r => cloud.get(`${test.api}/sent-messages`), { qs: { page: 1, pageSize: 1 } })
      .then(r => cloud.delete(`${test.api}/${dmId}`));
  });
});
