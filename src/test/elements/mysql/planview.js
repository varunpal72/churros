'use strict';

const suite = require('core/suite');
const payload = require('./assets/planview');
const options = {
  churros: {
    updatePayload: {
      "Hours": 0,
      "Work_Id": "test",
    }
  }
};
suite.forElement('db', 'plan_view', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportCeqlSearch('id');
  test.should.supportPagination();
});
