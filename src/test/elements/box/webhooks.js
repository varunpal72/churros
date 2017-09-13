'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const faker = require('faker');
const chakram = require('chakram');

const webhookPayload = (fileId) => ({"target":{"id":fileId,"type":"file"},"triggers":["METADATA_INSTANCE.CREATED","METADATA_INSTANCE.UPDATED","METADATA_INSTANCE.DELETED"]});
suite.forElement('documents', 'webhooks', null, (test) => {
  let fileId,path = __dirname + '/../assets/brady.jpg';
  let query = { path: `/brady-${faker.random.number()}.jpg` };;
  before(() => cloud.withOptions({ qs: query }).postFile('/hubs/documents/files', path)
  .then(r => fileId = r.body.id)
  );
  it('should support CRUDS for webhooks', () => {
    return cloud.cruds(test.api,webhookPayload(fileId),null,chakram.put);
  });
  after(() => cloud.delete('/hubs/documents/files/' + fileId));
});



