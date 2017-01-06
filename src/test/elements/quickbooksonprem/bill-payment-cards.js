'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('finance', 'bill-payment-cards', null , (test) => {
    it('should support S and Pagination for /hubs/finance/bill-payment-cards ', () => {
    return cloud.get(test.api)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api));
    });
});
