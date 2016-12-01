'use strict';

const suite = require('core/suite');
const payload = require('./assets/groups');

const options = {
  churros: {
    updatePayload: {
      "name": "UpdateGroupName",
    }
  }
};

suite.forElement('helpdesk', 'groups', { payload }, (test) => {
  test.should.supportPagination();
  test.withOptions(options).should.supportCruds();
});
