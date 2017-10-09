'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');


suite.forElement('employee', 'business', (test) => {

  test.should.supportPagination();
    return cloud.get(test.api);
});
