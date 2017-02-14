'use strict';

const suite = require('core/suite');
const payload = require('./assets/incident-types');
const cloud = require('core/cloud');
const updatePayload = {
  "displayOrder": 789
};

suite.forElement('helpdesk', 'incident-types', { payload: payload }, (test) => {

  it('should allow CRUDS for incedent-types', () => {

    let incidenttypesID;
    return cloud.post(test.api, payload)
      .then(r => incidenttypesID = r.body.id.id)
      .then(r => cloud.get(`${test.api}/${incidenttypesID}`))
      .then(r => cloud.patch(`${test.api}/${incidenttypesID}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${incidenttypesID}`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { where: `lastModifiedDate>='2014-01-15T00:00:00.000Z'` } }).get(test.api));
  });
});
