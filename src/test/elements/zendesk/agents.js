'use strict';

const suite = require('core/suite');
const payload = require('./assets/agents');

const options = {
  churros: {
    updatePayload: {
      "name": "Zendesk2",
      "email": "test_user123@cloud-elements.com"
    }
  }
};

suite.forElement('helpdesk', 'agents', { payload: payload }, (test) => {
  test.should.supportPagination();
  test.withOptions(options).should.supportCruds();
});
