'use strict';

const suite = require('core/suite');
const payload = require('./assets/lists');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const listsPayload = build({ Name: tools.random() });

suite.forElement('expense', 'lists', { payload: listsPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "Name": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCrus();
  test.should.supportNextPagePagination(2);
});