'use strict';

const suite = require('core/suite');
const payload = require('./assets/external-activity');
const attributePayload = require('./assets/attributes');
const cloud = require('core/cloud');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const activityPayload = build({
  apiName: tools.random(),
  triggerName: tools.random(),
  filterName: tools.random(),
  name: tools.random()
});

suite.forElement('marketing', 'external-activity', { payload: activityPayload }, (test) => {
  it('should allow GET external-activity/types, POST external-activity/type, PATCH external-activity/type/${apiName}/approve and PATCH external-activity/type/${apiName}/attributes ', () => {
    let apiName;
    return cloud.get(`${test.api}/types`)
      .then(r => cloud.post(`${test.api}/type`, activityPayload))
      .then(r => apiName = r.body[0].apiName)
      .then(r => cloud.patch(`${test.api}/type/${apiName}/approve`))
      .then(r => cloud.patch(`${test.api}/type/${apiName}/attributes`, attributePayload));
  });
});
