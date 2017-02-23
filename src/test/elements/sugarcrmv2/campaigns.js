'use strict';

const suite = require('core/suite');
const payload = require('./assets/campaigns');
const cloud = require('core/cloud');
const note = {
  "name": "Test Note",
  "description": "I am a test note"
};

suite.forElement('crm', 'campaigns', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  let campaignId, noteId;
  it('should support CRUDS for campaigns/notes', () => {
    return cloud.post(test.api, payload)
      .then(r => campaignId = r.body.id)
      .then(r => cloud.post(`${test.api}/${campaignId}/notes`, note))
      .then(r => noteId = r.body.id)
      .then(r => cloud.get(`${test.api}/${campaignId}/notes/${noteId}`))
      .then(r => cloud.patch(`${test.api}/${campaignId}/notes/${noteId}`, { "description": "this is an updated note" }))
      .then(r => cloud.delete(`${test.api}/${campaignId}/notes/${noteId}`))
      .then(r => cloud.delete(`${test.api}/${campaignId}`));
  });
});
