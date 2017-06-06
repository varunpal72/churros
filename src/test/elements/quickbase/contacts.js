'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const cloud = require('core/cloud');

suite.forElement('db', 'contacts', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportCeqlSearch('id');
  test.should.supportPagination();
  it('should POST contact, GET /contacts/fields and CR for attachment of that id', () => {
    let contactId, fieldId, record;
    return cloud.post(test.api, payload)
      .then(r => contactId = r.body.id)
      .then(r => cloud.get(`${test.api}/fields`))
      .then(r => {
        record = r.body.filter(function(list) {
          return list.label === "file";
        });
        fieldId = record[0]["@id"];
      })
      .then(r => cloud.withOptions({ qs: { fieldName: 'file' } }).postFile(`${test.api}/${contactId}/attachments`, __dirname + '/assets/attach.txt'))
      .then(r => cloud.get(`${test.api}/${contactId}/attachments/${fieldId}`))
      .then(r => cloud.delete(`${test.api}/${contactId}`));
  });
});
