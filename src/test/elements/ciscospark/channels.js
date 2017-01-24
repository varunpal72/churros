'use strict';
const chakram = require('chakram');
const suite = require('core/suite');
const payload = require('./assets/channels');

suite.forElement('collaboration', 'channels', { payload: payload }, (test) => {
  const opts = {
    churros: {
      updatePayload: {
        title: 'Churros Test Update'
      }
    }
  };
  test.withOptions(opts).should.supportCruds(chakram.put);
});
