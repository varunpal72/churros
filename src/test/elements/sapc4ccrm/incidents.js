'use strict';

const suite = require('core/suite');
const payload = require('./assets/incidents');
const commentsPayload = require('./assets/comments');
const cloud = require('core/cloud');

let options = {
  churros: {
    updatePayload: {
      "ServicePriorityCode": "3",
      "Name": {
        "content": "De-prioritized ticket to normal"
      }
    }
  }
};

suite.forElement('crm', 'incidents', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportCeqlSearch('id');
  test.should.supportPagination();
  //TODO need pagination for these???
  //TODO need where for these???
  it('should support CRUDS for /incidents/:id/comments', () => {
    let id;
    return cloud.post(test.api, payload)
      .then(r => {
        id = r.body.id;
        options.churros.updatePayload = { 'Text': 'Got the sauce, thanks for your patience', 'TypeCode': '10007'  };
      })
      .then(r => cloud.withOptions(options).cruds(`${test.api}/${id}/comments`, commentsPayload))
      .then(r => cloud.delete(`${test.api}/${id}`));
  });

});
