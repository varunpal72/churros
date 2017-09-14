'use strict';

const suite = require('core/suite');
const payload = require('./assets/updatePayload');
const cloud = require('core/cloud');
suite.forElement('finance', 'items', { payload: payload }, (test) => {
  test.should.supportPagination();
  test.should.supportNextPagePagination(1);
  it(`should support RUS and where for /hubs/crm/items`, () => {
    let itemId;
    return cloud.get('/hubs/finance/items')
      .then(r => itemId = r.body[0].id)
      .then(r => cloud.withOptions({ qs: { where: `id='${itemId}'` } }).get('/hubs/finance/items'))
      .then(r => cloud.get(`${test.api}/${itemId}`))
      .then(r => cloud.patch(`${test.api}/${itemId}`, payload));
  });
});
