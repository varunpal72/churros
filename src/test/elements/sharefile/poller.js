'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const moment = require('moment');

const rootFolder = '/My Files & Folders';

suite.forElement('documents', 'poller', (test) => {

  it('should poll for new file', () => {
    const query = { path: rootFolder + `/file-${tools.random()}.txt` };
    const path = __dirname + '/assets/file.txt';
    const options = { qs: { where: "lastmodifieddate='" + moment().subtract(5, 'seconds').format('YYYY-MM-DDTHH:mm:ss') + "Z'" } };
    const validateResults = (fileId, files) => {
        let isThere = false;
        files.forEach(file => isThere = (file.Id === fileId));
        return isThere;
    };
    let fileId;
    return cloud.postFile('/hubs/documents/files', path, { qs: query })
      .then(r => fileId = r.body.id)
      .then(r => cloud.withOptions(options).get('/hubs/documents/events/poll/documents'))
      .then(r => validateResults(fileId, r.body))
      .then(r => cloud.delete('/hubs/documents/files/' + fileId));
  });
});
