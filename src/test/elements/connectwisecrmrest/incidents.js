'use strict';

const suite = require('core/suite');
const payload = require('./assets/incidents');
const chakram = require('chakram');
const commentsPayload = require('./assets/comments');
const cloud = require('core/cloud');
const options = {
  churros: {
    updatePayload: {
      "summary": "maxLength = 100",
      "company": { "id": 641 },
      "board": {
        "name": "Professional Services",
        "id": 1
      },
      "status": {
        "name": "New (not responded)",
        "id": 16
      },
      "priority": {
        "name": "Priority 3",
        "id": 4,
        "sort": 6
      },
      "impact": "Medium",
      "severity": "Medium",
      "team": {
        "name": "Service Team",
        "id": 25
      }
    }
  }
};

suite.forElement('crm', 'incidents', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds(chakram.put); //test put
  test.withOptions(options).should.supportCruds(); //test patch
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
  it('should allow CRUDS for /hubs/helpdesk/incidents/{id}/comments', () => {
    let incidentId, commentsId;
    return cloud.post(test.api, payload)
      .then(r => incidentId = r.body.id)
      .then(r => cloud.post(`${test.api}/${incidentId}/comments`, commentsPayload))
      .then(r => commentsId = r.body.id)
      .then(r => cloud.get(`${test.api}/${incidentId}/comments/${commentsId}`))
      .then(r => cloud.patch(`${test.api}/${incidentId}/comments/${commentsId}`, {text: 'Hey, I am Churros, have fun'}))
      .then(r => cloud.delete(`${test.api}/${incidentId}/comments/${commentsId}`))
      .then(r => cloud.delete(`${test.api}/${incidentId}`));
  });
});
