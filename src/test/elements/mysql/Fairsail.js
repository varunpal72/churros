'use strict';

const suite = require('core/suite');
const payload = require('./assets/fairsail');
const options = {
  churros: {
    updatePayload: {
      "nameFS": "test1",
      "percentIncFS": 4.28
    }
  }
};
suite.forElement('db', 'Fairsail', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportCeqlSearch('id');
  test.should.supportPagination();
});
