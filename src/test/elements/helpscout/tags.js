'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('helpdesk', 'tags', null, (test) => {
  it(`should allow S and paginating with page ${test.api}`, () => {
    return cloud.get(test.api)
      .then(r => cloud.withOptions({ qs: { page: 2 } }).get(test.api));
  });
});
