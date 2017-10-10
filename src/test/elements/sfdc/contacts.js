'use strict';

//dependencies at the top
const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
//how to import payloads
const payload = tools.requirePayload(`${__dirname}/assets/contacts.json`);
const activities = tools.requirePayload(`${__dirname}/assets/activities.json`);
const notes = tools.requirePayload(`${__dirname}/assets/notes.json`);
const tasks = tools.requirePayload(`${__dirname}/assets/tasks.json`);

const contact = () => ({
  FirstName: 'Conan',
  LastName: 'Barbarian',
  Email: tools.randomEmail()
});

suite.forElement('crm', 'contacts', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportCeqlSearch('id');//search contacts by 'id'
  test.should.supportPagination();
  test.should.return404OnGet('0');//should not find contact with id of '0'

  //'it' statements for sfdc specific issues
  it('should allow CRUDS for /hubs/crm/contacts/:id/activites', () => {
    let contactId;
    return cloud.post(test.api, payload)
      .then(r => contactId = r.body.id)
      .then(r => cloud.cruds(`${test.api}/${contactId}/activities`, activities))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });

  it('should allow CRUDS for /hubs/crm/contacts/:id/notes', () => {
    let contactId;
    return cloud.post(test.api, payload)
      .then(r => contactId = r.body.id)
      .then(r => cloud.cruds(`${test.api}/${contactId}/notes`, notes))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });

  it('should allow CRUDS for /hubs/crm/contacts/:id/tasks', () => {
    let contactId;
    return cloud.post(test.api, payload)
      .then(r => contactId = r.body.id)
      .then(r => cloud.cruds(`${test.api}/${contactId}/tasks`, tasks))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });

  it('should allow CRUDS for /contacts/:id/attachments', () => {
    let contactId, attachmentId;

    return cloud.post(test.api, contact())
      .then(r => contactId = r.body.id)
      .then(r => cloud.postFile(`/hubs/crm/Contact/${contactId}/attachments`, __dirname + '/assets/attach.txt'))
      .then(r => attachmentId = r.body.id)
      .then(r => cloud.get(`/hubs/crm/Contact/${contactId}/attachments`))
      .then(r => cloud.get(`/hubs/crm/attachments/${attachmentId}`))
      .then(r => cloud.get(`/hubs/crm/attachments/${attachmentId}/data`))
      .then(r => cloud.patchFile(`/hubs/crm/attachments/${attachmentId}`, __dirname + '/assets/update.txt'))
      .then(r => cloud.delete(`/hubs/crm/attachments/${attachmentId}`))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });

  it('should not allow malformed bulk query and throw a 400', () => {
    return cloud.withOptions({ qs: { q: 'select * contacts' } })
      .post('/hubs/crm/bulk/query', null,
        r => {
          (expect(r).to.have.statusCode(400) && expect(r.body.message).to.include('Error parsing query')); });
  });
  it('should find contact with quote in first name', () => {
    let contactId;
    let contactPayload = {
      "firstName": "Churro's",
      "lastName": "TestDude",
      "title": "Salesman",
      "department": "Sales",
      "phone": "444-444-4444",
      "email": "bob@churrostest.com"
    };
    let query = { where: "Name='Churro''s TestDude'" };

    return cloud.post(test.api, contactPayload)
      .then(r => contactId = r.body.id)
      .then(r => cloud.withOptions({ qs: query }).get(test.api))
      .then(r => expect(r).to.have.statusCode(200) && expect(r.body).to.not.be.null &&
        expect(r.body).to.be.a('array') && expect(r.body).to.have.length.above(0) &&
        expect(r.body[0]).to.contain.key('Name') &&
        expect(r.body[0].Name).to.equal("Churro's TestDude"))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });
});
