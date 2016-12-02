'use strict';

const suite = require('core/suite');
const payload = require('./assets/accounts');
const tools = require('core/tools');
suite.forElement('marketing', 'accounts', { payload: payload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
            "name": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
});
