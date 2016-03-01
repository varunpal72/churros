'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const cloud = require('core/cloud');
const tools = require('core/tools');

const contact = () => ({
  FirstName: 'Conan',
  LastName: 'Barbarian',
  Email: tools.randomEmail()
});


suite.forElement('crm', 'contacts', payload, (test) => {
  test.should.supportCruds();
  test.should.supportCeqlSearch('id');

  it('should allow CRUDS for /contacts/:id/attachments', () => {
    let contactId;
    let attachmentId;
    return cloud.post(test.api, contact())
      .then(r => contactId = r.body.id)
      .then(r => cloud.postFile(test.api + '/' + contactId + '/attachments', __dirname + '/assets/attach.txt'))
      .then(r => attachmentId = r.body.id)
      .then(r => cloud.get(test.api + '/' + contactId + '/attachments/' + attachmentId))
      .then(r => cloud.get('/hubs/crm/attachments/' + attachmentId + '/data'))
      .then(r => cloud.patchFile('/hubs/crm/attachments/' + attachmentId, __dirname + '/assets/update.txt'))
      .then(r => cloud.delete('/hubs/crm/attachments/' + attachmentId))
      .then(r => cloud.delete(test.api + '/' + contactId));
  });

});
