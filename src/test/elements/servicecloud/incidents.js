'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = require('./assets/incidents');
const incidentsCommentspayload = require('./assets/incidentsComments');

suite.forElement('helpdesk', 'incidents', { payload: payload }, (test) => {
  const updatePayload = {
    "subject": tools.random()
  };

  test.withOptions({ churros: { updatePayload: updatePayload } }).should.supportCruds();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'createdTime = `2014-03-18T13:39:05+0000`' } }).should.return200OnGet();

  it('should allow RUS for incident comments', () => {
    let incidentID;
    return cloud.post(test.api, payload)
      .then(r => incidentID = r.body.id)
      .then(r => cloud.get(`${test.api}/${incidentID}/comments`))
      .then(r => cloud.withOptions({ qs: { where: `createdTime>='2014-04-02T18:28:30+0000'` } }).get(`${test.api}/${incidentID}/comments`))
      .then(r => cloud.put(`${test.api}/${incidentID}/comments`, incidentsCommentspayload))
      .then(r => cloud.delete(`${test.api}/${incidentID}`));
  });

});
