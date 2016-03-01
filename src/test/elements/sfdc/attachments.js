'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = require('./assets/attachments');
const fs = require('fs');
let path = __dirname + '/assets/attach';

const contact = () => ({
  FirstName: 'Conan',
  LastName: 'Barbarian',
  Email: tools.randomEmail()
});

const attachPath = ('./assets/attach.txt');
const updatePath = ('./assets/update.txt');

suite.forElement('crm', 'attachments', payload, (test) => {
  it('should allow CRUDS for ' + test.api, () => {
    let contactId;
    let attachmentId;
    return cloud.post('/hubs/crm/contacts', contact())
      .then(r => contactId = r.body.id)
      .then(r => {
      	fs.closeSync(fs.openSync(attachPath, 'w'));
      	return cloud.postFile('/hubs/crm/Contact/' + contactId + '/attachments', path)
      })
      .then(r => fs.unlink(attachPath))
      .then(r => attachmentId = r.body.id)
      .then(r => cloud.get(test.api + '/' + attachmentId))
      .then(r => cloud.get(test.api + '/' + attachmentId + '/' + 'data'))
      .then(r => cloud.update(test.api + '/' + r.body.id, update_attachment))
      .then(r => cloud.delete('/hubs/crm/attachments/' + attachmentId))
      .then(r => cloud.delete('/hubs/crm/contacts/' + contactId));
  });
});
