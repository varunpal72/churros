'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('helpdesk', 'tags', null, (test) => {
  test.should.supportS();

  it(`should allow paginating with page ${test.api}`, () => {
    return cloud.withOptions({ qs: { page: 2 } }).get(test.api);
  });
});
