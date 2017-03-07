'use strict';

const suite = require('core/suite');
// const payload = require('./assets/orders');
const cloud = require('core/cloud');
const payload = require('./assets/products');
const options = {
  churros: {
    updatePayload: {
      "description": "Update the product listing"
    }
  }
};

suite.forElement('ecommerce', 'products', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.withApi(`${test.api}-drafts`).should.return200OnGet();
  test.withApi(`${test.api}-drafts`).should.supportPagination();

  it('should be that number of products retrieved be equal to or less than page size', () => {
    let length = 1;
    return cloud.get(`${test.api}?pageSize=${length}`)
      .then(r => {
        if (r.body.length <= length) {
          return;
        }
        length = 2;
        return cloud.get(`${test.api}?pageSize=${length}`)
          .then(r => {
            if (r.body.length <= length) {
              return;
            }
          });
      });
  });

  it('should return 1st product on 2nd page immediately after last item on 1st page', () => {
    let page2Id;
    return cloud.get(test.api)
      .then(r => {
        if (r.body.length < 2) {
          return;
        } else {
          let pageSize = 3;
          page2Id = r.body[pageSize].listing_id;
          return cloud.get(`${test.api}?page=2&pageSize=${pageSize}`)
            .then(r => {
              if (page2Id === r.body[0].listing_id) {
                return;
              }
            });
        }
      });
  });

  it(`should support Ru for ${test.api}/{id}/inventory`, () => {
    let productId;
    let inventoryPayload = {
      "products": {
        "sku": "string",
        "offerings": [{
          "price": 22.22,
          "quantity": 20
        }]
      }
    };
    return cloud.post(test.api, payload)
      .then(r => productId = r.body.id)
      .then(r => cloud.patch(`${test.api}/${productId}/inventory`, inventoryPayload))
      .then(r => cloud.get(`${test.api}/${productId}/inventory`))
      .then(r => cloud.delete(`${test.api}/${productId}`));
  });

});
