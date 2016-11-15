'use strict';

const suite = require('core/suite');
const payload = require('./assets/opportunities');

suite.forElement('crm', 'opportunities', { payload: payload }, (test) => {
  const options = {
      churros: {
          updatePayload: {
              "name": "Robot Opportunity Updated 1"
          }
      }
  };
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
});
