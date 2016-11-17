'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('crm', 'products', { payload:null }, (test) => {
  test.should.supportPagination();
  let id;
  return cloud.get(test.api)
      .then(r => id = r.body[0].id)
      .then(r => cloud.get(`${test.api}`),{ qs: { where:'id="${id}"' } });
});
