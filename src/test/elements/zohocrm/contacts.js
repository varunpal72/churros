'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const payload2 = require('./assets/notes');
const cloud = require('core/cloud');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const build2 = (overrides) => Object.assign({}, payload2, overrides);
const contactsPayload = build({ firstName: tools.random(), lastName: tools.random() });
const notesPayload = build2({ Title: tools.random() });

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

  it('should allow CRUDS for contacts/{id}/notes', () => {
    let contactId = -1;
    return cloud.post(test.api, contactsPayload)
      .then(r => contactId = r.body.id)
      .then(r => cloud.cruds(`${test.api}/${contactId}/notes`, notesPayload))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${contactId}/notes`))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });
});