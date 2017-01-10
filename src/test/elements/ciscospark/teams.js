'use strict';
const chakram = require('chakram');
const suite = require('core/suite');
const payload = require('./assets/teams');

suite.forElement('collaboration', 'teams', { payload: payload }, (test) => {
   const opts = {
    churros: {
      updatePayload: {
        name: 'Churros Team Update'
      }
    }
  };
  test.withOptions(opts).should.supportCruds(chakram.put);
});
