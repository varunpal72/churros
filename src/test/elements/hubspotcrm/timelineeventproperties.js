'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/timelineeventproperties');

suite.forElement('crm', 'timeline-event-types', (test) => {

  it('should test CUDS for /timelineeventtypes/{id}/properties ', () => {
    let id = 19073,
      propertyId;
    return cloud.get(`${test.api}/${id}/properties`)
      .then(r => cloud.post(`${test.api}/${id}/properties`, payload))
      .then(r => propertyId = r.body.id)
      // In payload 'name' must be unique , so for every test make sure it is different
      .then(r => cloud.patch(`${test.api}/${id}/properties/${propertyId}`, payload))
      .then(r => cloud.delete(`${test.api}/${id}/properties/${propertyId}`));
  });

});
