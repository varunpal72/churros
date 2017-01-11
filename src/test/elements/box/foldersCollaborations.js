'use strict';

const cloud = require('core/cloud');
const suite = require('core/suite');
const folderPayload = require('./assets/folders');

suite.forElement('documents', 'folders', { payload: folderPayload }, (test) => {
  it(`should allow CD for ${test.api} and GET collaborations`, () => {
    let folderId;
    return cloud.post(test.api, folderPayload)
      .then(r => folderId = r.body.id)
      .then(r => cloud.get(`${test.api}/${folderId}/collaborations`))
      .then(() => cloud.delete(`${test.api}/${folderId}`));
  });
});
