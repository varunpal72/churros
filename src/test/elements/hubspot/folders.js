'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/folders.json`);
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
