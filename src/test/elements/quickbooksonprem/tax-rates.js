'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('finance', 'tax-rates', null , (test) => {
    it('should support S,Pagination and CeqlSearch for /hubs/finance/tax-rates ', () => {
    return cloud.get(test.api)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api));
    });
});
