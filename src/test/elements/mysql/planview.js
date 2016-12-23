'use strict';

const suite = require('core/suite');
const payload = require('./assets/planview');
const update = () => ({
  "Hours": 0,
  "Work_Id": "test",
});

const options = { churros: { updatePayload: update() } };
suite.forElement('db', 'plan_view', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportCeqlSearch('id');
  test.should.supportPagination();
});
