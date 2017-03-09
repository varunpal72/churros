'use strict';

const suite = require('core/suite');
const chakram = require('chakram');
const cloud = require('core/cloud');
const payload = require('./assets/contacts');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const contactsPayload = build({
  name: tools.random(),
  first_name: tools.random(),
  last_name: tools.random(),
  email1: {
    value: tools.randomEmail(),
    label: tools.random()
  },
  email2: {
    value: tools.randomEmail(),
    label: tools.random()
  },
  email3: {
    value: tools.randomEmail(),
    label: tools.random()
  },
  phone1: {
    value: tools.randomInt() + '1234' + tools.randomInt(),
    label: tools.random()
  },
  phone2: {
    value: tools.randomInt() + '3456' + tools.randomInt(),
    label: tools.random()
  },
  phone3: {
    value: tools.randomInt() + '5678' + tools.randomInt(),
    label: tools.random()
  }
});

suite.forElement('crm', 'contacts', { payload: contactsPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "name": tools.random(),
        "email1": {
          "value": tools.randomEmail(),
          "label": tools.random()
        },
        "email2": {
          "value": tools.randomEmail(),
          "label": tools.random()
        },
        "email3": {
          "value": tools.randomEmail(),
          "label": tools.random()
        },
        "phone1": {
          "value": tools.randomInt() + '1234' + tools.randomInt(),
          "label": tools.random()
        },
        "phone2": {
          "value": tools.randomInt() + '3456' + tools.randomInt(),
          "label": tools.random()
        },
        "phone3": {
          "value": tools.randomInt() + '5678' + tools.randomInt(),
          "label": tools.random()
        }
      }
    }
  };
  test.withOptions(options).should.supportCruds(chakram.put);
  test.should.supportPagination();
  test.should.supportCeqlSearch('name');

  const updatePayloadActivities = {
    "subject": tools.random()
  };
  const activitiesPayload = {
    "subject": tools.random(),
    "type": "call",
    "due_date": "2015-04-24",
    "due_time": "12:30"
  };
  it('should support CRUDS for contacts/activities', () => {
    let contactId, activitiesId;
    return cloud.post(test.api, payload)
      .then(r => contactId = r.body.id)
      .then(r => cloud.get(`${test.api}/${contactId}/activities`))
      .then(r => cloud.post(`${test.api}/${contactId}/activities`, activitiesPayload))
      .then(r => activitiesId = r.body.id)
      .then(r => cloud.get(`${test.api}/${contactId}/activities/${activitiesId}`))
      .then(r => cloud.put(`${test.api}/${contactId}/activities/${activitiesId}`, updatePayloadActivities))
      .then(r => cloud.delete(`${test.api}/${contactId}/activities/${activitiesId}`));
  });

  const updatePayloadNotes = {
    "content": "<h2>" + tools.randomStr() + "<h1>"
  };
  const notesPayload = {
    "content": "<h1> Helllo <h1>"
  };
  it('should support CRUDS for contacts/notes', () => {
    let contactId, notesId;
    return cloud.post(`${test.api}`, payload)
      .then(r => contactId = r.body.id)
      .then(r => cloud.get(`${test.api}/${contactId}/notes`))
      .then(r => cloud.post(`${test.api}/${contactId}/notes`, notesPayload))
      .then(r => notesId = r.body.id)
      .then(r => cloud.get(`${test.api}/${contactId}/notes/${notesId}`))
      .then(r => cloud.put(`${test.api}/${contactId}/notes/${notesId}`, updatePayloadNotes))
      .then(r => cloud.delete(`${test.api}/${contactId}/notes/${notesId}`))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });

  it('should GET /contacts emails and mails', () => {
    let contactId;
    return cloud.post(test.api, contactsPayload)
      .then(r => contactId = r.body.id)
      .then(r => cloud.get(`${test.api}/${contactId}/emails`))
      .then(r => cloud.get(`${test.api}/${contactId}/mails`))
      .then(r => cloud.delete(`${test.api}/${contactId}`));

  });
});
