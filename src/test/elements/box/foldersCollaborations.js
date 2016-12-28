'use strict';
const cloud = require('core/cloud');
const suite = require('core/suite');
const folderPayload = require('./assets/folders');

suite.forElement('documents', 'folders', { payload: folderPayload }, (test) => {
  it('should allow CD for ${test.api} and GET collaborations', () => {
    let folder;
    return cloud.post(test.api, folderPayload)
      .then(r => folder = r.body)
      .then(r => cloud.get(`${test.api}/${folder.id}/collaborations`))
      .then(() => cloud.delete(`${test.api}/${folder.id}`));
  });
});
