'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const faker = require('faker');

suite.forElement('documents', 'webhooks', null, (test) => {
  it('should allow CRUDS for webhooks', () => {
    let fileId,webhookId;
    let path = __dirname + '/../assets/brady.jpg';
    let query = { path: `/brady-${faker.random.number()}.jpg` };
    return cloud.withOptions({ qs: query }).postFile('/hubs/documents/files', path)
      .then(r => fileId = r.body.id)
      .then(r => cloud.post(test.api,{"target":{"id":fileId,"type":"file"},"triggers":["METADATA_INSTANCE.CREATED","METADATA_INSTANCE.UPDATED"                                     ,"METADATA_INSTANCE.DELETED"]}))
      .then(r => webhookId = r.body.id)
      .then(r => cloud.put(test.api+ '/' + webhookId,{"target":{"id":fileId,"type":"file"},"triggers":["METADATA_INSTANCE.CREATED",
                                                     "METADATA_INSTANCE.UPDATED","METADATA_INSTANCE.DELETED"]}))
      .then(r => cloud.get(test.api))
      .then(r => cloud.get(test.api + '/' + webhookId))
      .then(r => cloud.delete(test.api + '/' + webhookId))
      .then(r => cloud.delete('/hubs/documents/files/' + fileId));
  });
});


