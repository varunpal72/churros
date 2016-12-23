'use strict';

const suite = require('core/suite');
const payload = require('./assets/fairsail');
const update = () => ({
  "nameFS": "test1",
  "percentIncFS": 4.28
});

const options = { churros: { updatePayload: update() } };
suite.forElement('db', 'Fairsail', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportCeqlSearch('id');
  test.should.supportPagination();
});
