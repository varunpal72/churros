'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');

const lock = () => ({
   "is_download_prevented" : false,
   "expires_at" : "2030-12-12T10:55:30-08:00" 
});



suite.forElement('documents', 'files', null, (test) => {

  it('should allow Lock/Unlock for files', () => {
    let fileId;
    let path = __dirname + '/../assets/brady.jpg';
    let query = { path: `/brady-${tools.random()}.jpg` };
    return cloud.withOptions({ qs: query }).postFile('/hubs/documents/files', path)
      .then(r => fileId = r.body.id)
      .then(r => cloud.patch('/hubs/documents/files/' + fileId + '/lock', null, null, lock))
      .then(r => cloud.patch('/hubs/documents/files/' + fileId + '/unlock'))
      .then(r => cloud.delete(test.api + '/' + fileId));
  });

});
