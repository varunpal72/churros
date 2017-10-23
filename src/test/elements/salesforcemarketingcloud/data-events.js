'use strict';
const cloud = require('core/cloud');
const suite = require('core/suite');
//Note: DataEventPayload does not generate values dynamically but it is techinically un upsert so it is okay To post repeate values
const DataEventPayload = require('./assets/DataEvent');
const updatePayload = {
  "values": {
    "FirstName": "hollagin",
    "FollowerCount": 0,
    "IsActive": true,
    "LastLogin": "today",
    "LastName": "stiltz"
  }
};
const incrementPayload = {
  "step": 3
};

//data-events are very account unique I set the primary key in our account to be First Name and added data that exists under that.
suite.forElement('marketing', 'data-events', (test) => {
  it('should allow CU for /data-events', () => {
    let eventId = '70F95B23-E336-4B82-966F-C42B5AC44ABB';
    let columnName = 'Number';
    let key;
    return cloud.post(test.api, DataEventPayload)
      .then(r => {
        let body = r.body[0].keys;
        for (var keys in body) {
          key = keys + ":" + body[keys];
        }
      })
      .then(r => cloud.put(`${test.api}/${eventId}/rows/${key}`, updatePayload))
      .then(r => cloud.put(`${test.api}/${eventId}/rows/${key}/column/${columnName}/increment`, incrementPayload));

  });
});
