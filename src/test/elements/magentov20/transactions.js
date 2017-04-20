'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('ecommerce', 'transactions', (test) => {
    test.should.supportPagination();
  let id,createdAt;
     return cloud.get(`${test.api}`)
       .then(r => {
         if (r.body.length <= 0) {
           return;
         }
         id = r.body[0].id;
         createdAt = r.body[0].created_at;
         return cloud.get(`/hubs/ecommerce/transactions/${id}`)
           .then(r => cloud.withOptions({ qs: { where: `created_at = '${createdAt}'` } }).get(`${test.api}`));
       });

});
