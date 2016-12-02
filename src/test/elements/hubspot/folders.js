'use strict';

const suite = require('core/suite');
const payload = require('./assets/folders');
const tools = require('core/tools');
const options = {
  churros: {
    updatePayload: {
          "name": tools.random()
    }
  }
};
suite.forElement('marketing', 'folders', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
});
