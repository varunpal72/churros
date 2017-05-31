'use strict';

const suite = require('core/suite')
const cloud = require('core/cloud');

suite.forElement('finance', 'report-types', null, (test) => {
  it('should support GET for /hubs/finance/report-types', () => {
    return cloud.get(test.api);
  });
});
