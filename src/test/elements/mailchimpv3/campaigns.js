'use strict';

const suite = require('core/suite');
const payload = require('core/tools').requirePayload(`${__dirname}/assets/campaigns.json`);
const cloud = require('core/cloud');

const updatePayload = () => ({
  "recipients": {
    "list_id": "7c11127640"
  },
  "type": "regular",
  "settings": {
    "subject_line": "Churros Update",
    "reply_to": "churros@cloud-elements.com",
    "from_name": "Senor Churro"
  }
});

const commentsPayload = () => ({
  "message": "Churros please"
});

const commentsUpdate = () => ({
  "message": "More churros please"
});

const options = {
  churros: {
    updatePayload: updatePayload()
  }
};

suite.forElement('marketing', 'campaigns', { payload: payload }, (test) => {
  test.should.supportPagination('id');
  test.withOptions(options).should.supportCruds();
  test.withOptions({ qs: { where: 'since_create_time=\'2016-01-23T17:55:00+00:00\'' } }).should.return200OnGet();

  it('should allow CRUDS for campaigns/{id}/comments', () => {
    let campaignId = -1;
    let commentId = -1;
    return cloud.post(test.api, payload)
      .then(r => campaignId = r.body.id)
      .then(r => cloud.post(`${test.api}/${campaignId}/comments`, commentsPayload()))
      .then(r => commentId = r.body.feedback_id)
      .then(r => cloud.get(`${test.api}/${campaignId}/comments/${commentId}`))
      .then(r => cloud.patch(`${test.api}/${campaignId}/comments/${commentId}`, commentsUpdate()))
      .then(r => cloud.post(`${test.api}/${campaignId}/comments`, commentsPayload()))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${campaignId}/comments`))
      .then(r => cloud.delete(`${test.api}/${campaignId}/comments/${commentId}`))
      .then(r => cloud.delete(`${test.api}/${campaignId}`));
  });
});
