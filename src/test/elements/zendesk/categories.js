'use strict';

const suite = require('core/suite');
const payload = require('./assets/categories');

const options = {
  churros: {
    updatePayload: {
      "name": "Example Category 3",
      "description": "An Update Done via API",
      "position": 2,
      "locale": "us-en"
    }
  }
};

suite.forElement('helpdesk', 'resources/categories', { payload }, (test) => {
  test.should.supportPagination();
  test.withOptions(options).should.supportCruds();
});
