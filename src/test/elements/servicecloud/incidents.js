'use strict';

const suite = require('core/suite');
const payload = require('./assets/incidents');
const incidentsCommentspayload = require('./assets/incidentsComments');
const tools = require('core/tools');
const cloud = require('core/cloud');

suite.forElement('helpdesk', 'incidents', { payload: payload }, (test) => {

  it('should allow CRUDS for incedents', () => {
    let incidentID, commentID;
    return cloud.post(test.api, payload)
      .then(r => incidentID = r.body.id.id)
      .then(r => cloud.get(`${test.api}/${incidentID}`))
      .then(r => cloud.patch(`${test.api}/${incidentID}`, payload))
      .then(r => cloud.get(`${test.api}/${incidentID}/comments`))
      .then(r => cloud.withOptions({ qs: { where: `createdTime>='2014-04-02T18:28:30+0000'` } }).get(`${test.api}/${incidentID}/comments`))
      .then(r => cloud.put(`${test.api}/${incidentID}/comments`, incidentsCommentspayload))
      .then(r => cloud.delete(`${test.api}/${incidentID}`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { where: `createdTime>='2014-03-18T13:39:05+0000'` } }).get(test.api));
  });
});
