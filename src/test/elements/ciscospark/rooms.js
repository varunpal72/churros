'use strict';
const chakram = require('chakram');
const suite = require('core/suite');
const payload = require('./assets/rooms');

suite.forElement('collaboration', 'rooms', { payload: payload }, (test) => {
   const opts = {
    churros: {
      updatePayload: {
        title: 'Churros Test Update'
      }
    }
  };
  test.withOptions(opts).should.supportCruds(chakram.put);
});
