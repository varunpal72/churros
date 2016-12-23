'use strict';

const suite = require('core/suite');
const payload = require('./assets/bulky');
const update = () => ({
  "name": "test-churros"
});

const options = { churros: { updatePayload: update() } };
suite.forElement('db', 'bulky', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportCeqlSearch('id');
  test.should.supportPagination();
});
