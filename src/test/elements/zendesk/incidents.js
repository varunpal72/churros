'use strict';

const suite = require('core/suite');
const payload = require('./assets/incidents');

const options = {
  churros: {
    updatePayload: {
      "status": "closed",
      "summary": "Updated Summary"
    }
  }
};

suite.forElement('helpdesk', 'incidents', { payload }, (test) => {
  test.should.supportPagination();
  test.withOptions(options).should.supportCruds();
});
