'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('finance', 'sales-tax-items', (test) => {
  it('should support GET /sales-tax-items', () => {
    cloud.withOptions({ qs: { page: 1, pageSize: 5 } }).get(test.api);
  });
});
