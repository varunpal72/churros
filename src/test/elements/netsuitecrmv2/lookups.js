'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('crm', 'lookups', null, (test) => {
  it('should allow GET for /hubs/erp/lookups/:fieldName ', () => {
    let fieldName = 'currency';
    return cloud.get(`${test.api}/${fieldName}`)
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 5 } }).get(`${test.api}/${fieldName}`));
  });
});
