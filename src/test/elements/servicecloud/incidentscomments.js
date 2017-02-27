'use strict';

const suite = require('core/suite');
const payload = require('./assets/incidents');
const incidentsCommentspayload = require('./assets/incidentsComments');
const cloud = require('core/cloud');

suite.forElement('helpdesk', 'incidents', { payload: payload }, (test) => {

  it('should allow up for incedentsComments', () => {
    let incidentID;
    return cloud.post(test.api, payload)
      .then(r => incidentID = r.body.id)
      .then(r => cloud.get(`${test.api}/${incidentID}/comments`))
      .then(r => cloud.withOptions({ qs: { where: `createdTime>='2014-04-02T18:28:30+0000'` } }).get(`${test.api}/${incidentID}/comments`))
      .then(r => cloud.put(`${test.api}/${incidentID}/comments`, incidentsCommentspayload))
      .then(r => cloud.delete(`${test.api}/${incidentID}`));
  });
});
