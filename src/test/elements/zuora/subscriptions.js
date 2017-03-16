'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('finance', 'subscriptions', null, (test) => {
  // currently hardcoded, but we need a way to get this dynamically.
  const id = "7735e9348312dbd53d4ac6368c00c44c";

  it(`should get ${test.api}/:id`, () => {
    return cloud.get(`${test.api}/${id}`);
  });
});
