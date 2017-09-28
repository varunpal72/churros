'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const contactsPayload = tools.requirePayload(`${__dirname}/assets/contacts.json`);
const notesPayload = tools.requirePayload(`${__dirname}/assets/notes.json`);

suite.forElement('crm', 'contacts', { payload: contactsPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "firstName": tools.random(),
        "lastName": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearchForMultipleRecords('email');

  it('should allow CRUDS for contacts/{id}/notes', () => {
    let contactId = -1;
    return cloud.post(test.api, contactsPayload)
      .then(r => contactId = r.body.id)
      .then(r => cloud.cruds(`${test.api}/${contactId}/notes`, notesPayload))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${contactId}/notes`))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });
});
