'use strict';

const suite = require('core/suite');
const payload = require('./assets/campaigns');
const cloud = require('core/cloud');
  suite.forElement('marketing', 'campaigns', { payload: payload} , (test) => {
    it('it should support CRUDS for campaigns', () => {
      let msgId;
       return cloud.post(test.api,payload)
       .then(r => msgId = r.body.msg_id)
       .then(r => cloud.get(`${test.api}/${msgId}`))
       .then(r => cloud.patch(`${test.api}/${msgId}`,payload))
       .then(r => cloud.get(test.api))
       .then(r => cloud.get(`${test.api}/${msgId}/reports`))
       .then(r => cloud.get(`${test.api}/${msgId}/reports/SENT`))
       .then(r => cloud.delete(`${test.api}/${msgId}`));
    });
});
