'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');

suite.forElement('marketing', 'contacts', { payload: payload }, (test) => {
  const opts = {
    churros: {
      updatePayload: {
        city: "TheRobot"
      }
    }
  };
  test.withOptions(opts).should.supportCruds();
});
