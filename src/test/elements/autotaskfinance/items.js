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
    .then(r => {
      if (r.body.length <= 0) {
        return;
      }
      itemId = r.body[0].id;
      test
        .withName(`should support searching ${test.api} by itemId`)
        .withOptions({ qs: { where: `id = '${itemId}'` } })
        .withValidation((r) => {
          expect(r).to.have.statusCode(200);
          const validValues = r.body.filter(obj => obj.id = `${itemId}`);
          expect(validValues.length).to.equal(r.body.length);
        }).should.return200OnGet();

      return cloud.get(`${test.api}/${itemId}`)
      .then(r => cloud.patch(`${test.api}/${itemId}`, payload));
      });
  });
});
