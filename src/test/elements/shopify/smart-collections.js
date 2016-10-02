'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/smart-collection.json');
const smartCollectionUpdate = {"title": "MyCollection"};

suite.forElement('shopify', 'smart-collections', { payload: payload }, (test) => {
    let smartCollectionId;
  it('should allow CS for /smart-collections', () => {
    return cloud.post('/hubs/ecommerce/smart-collections', payload)
      .then(r => smartCollectionId = r.body.id)
      .then(r => cloud.get('/hubs/ecommerce/smart-collections'))
      .then(r => cloud.delete('/hubs/ecommerce/smart-collections/' + smartCollectionId));
  });

  it('should allow CRUDS for /smart-collections/:id', () => {
    let smartCollectionId;

    return cloud.post('/hubs/ecommerce/smart-collections', payload)
      .then(r => smartCollectionId = r.body.id)
      .then(r => cloud.patch('/hubs/ecommerce/smart-collections/' + smartCollectionId, smartCollectionUpdate))
      .then(r => cloud.get('/hubs/ecommerce/smart-collections/' + smartCollectionId))
      .then(r => cloud.delete('/hubs/ecommerce/smart-collections/' + smartCollectionId));
  });
});
