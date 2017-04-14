'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = () => ({
  "emailFS": "test@gmail.com",
  "nameFS": "test1",
  "percentIncFS": 4.28,
  "id": tools.randomInt(),
  "salaryFS": 12345
});

const options = {
  churros: {
    updatePayload: {
      "nameFS": "test1",
      "percentIncFS": 4.28
    }
  }
};
suite.forElement('db', 'Fairsail', { payload: payload() }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportCeqlSearch('id');
  test.should.supportPagination();
});
