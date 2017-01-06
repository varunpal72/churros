'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('helpdesk', 'fields', (test) => {
  it(`should support paging, Ceql search and S for ${test.api}`, () => {
    let type = "incident-field";
    return cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${type}`)
      .then(r => cloud.withOptions({ qs: { where: 'type = string' } }).get(`${test.api}/${type}`));
  });
});
