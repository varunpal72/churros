'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const expect = require('chakram').expect;
const productsPayload = tools.requirePayload(`${__dirname}/assets/products.json`);

suite.forElement('crm', 'products', { payload: productsPayload }, (test) => {
  const objectRelatedPayload = (productId) => ({
    "PRODUCTID": productId.toString()
  });
  const options = {
    churros: {
      updatePayload: {
        "Product Name": tools.random()
      }
    }
  };
  
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  
  test
    .withName(`should support searching ${test.api} by Modified Time`)
    .withOptions({ qs: { where: `'Modified Time'>'2016-06-22 11:15:20'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.modified_date >='2016-06-22 11:15:20');
      expect(validValues.length).to.equal(r.body.length);
   }).should.return200OnGet();


it(`should update product related to account`, () => {
  let accountId, productId;
  return cloud.get(test.api)
    .then(r => productId= r.body[0].id)
    .then(r => cloud.get('/hubs/crm/accounts'))
    .then(r => accountId = r.body[0].id)
    .then(r => cloud.patch(`${test.api}/accounts/${accountId}`, objectRelatedPayload(productId)));
  });
});
