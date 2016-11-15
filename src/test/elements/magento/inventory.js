'use strict';

const suite = require('core/suite');
const payload = require('./assets/inventory');
const cloud = require('core/cloud');

suite.forElement('ecommerce', 'inventory', {payload: payload, skip: true}, (test) => {
  test.should.return200OnGet();
  test.should.supportPagination();
  it('should allow RUS for inventory with PUT', () => {
    let inventoryItem;
    let inventoryId;
    return cloud.get(test.api)
    .then((r) => {
      if (r.body.length <= 0) {
        return;
      }
      inventoryItem = r.body[0];
      inventoryItem.qty = "45.0000";
      inventoryId = inventoryItem.item_id;
    })
    .then(r => cloud.get(`${test.api}/${inventoryId}`))
    .then(r => cloud.put(`${test.api}/${r.body.item_id}`, inventoryItem));
  });
});
