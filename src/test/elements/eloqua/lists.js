'use strict';

const suite = require('core/suite');
const payload = require('./assets/lists');

suite.forElement('marketing', 'lists', { payload: payload }, (test) => {
  const opts = {
    churros: {
      updatePayload: {
        name: "Test List Updated"
      }
    }
  };
  test.withOptions(opts).should.supportCruds();
});
