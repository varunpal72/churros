'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/smart-collection.json');
const smartCollectionUpdate = { "title": "newSmartCollection" };

suite.forElement('shopify', 'smart-collections', { payload: payload }, (test) => {

  it('should allow CS for /smart-collections', () => {
    return cloud.post('/hubs/ecommerce/smart-collections', payload)
      .then(r => cloud.get('/hubs/ecommerce/smart-collections'))
  });

  it('should allow CRUDS for /smart-collections/:id', () => {
    let collectionId;

    return cloud.post('/hubs/ecommerce/smart-collections', payload)
      .then(r => smartCollectionId = r.body.id)
      .then(r => cloud.patch('/hubs/ecommerce/smart-collections/' + smartCollectionId, smartCollectionUpdate))
      .then(r => cloud.get('/hubs/ecommerce/smart-collections/' + smartCollectionId))
      .then(r => cloud.delete('/hubs/ecommerce/smart-collections/' + smartCollectionId));
  });
});
