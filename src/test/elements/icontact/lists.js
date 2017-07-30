'use strict';

const suite = require('core/suite');
const chakram = require('chakram');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/lists.json`);

suite.forElement('general', 'lists', { payload: payload }, (test) => {

  const options = {
    churros: {
      updatePayload: {
        "name": "Barclays Premiere League"
      }
    }
  };
  test.withOptions(options).should.supportCruds(chakram.put);
  test.should.supportPagination();
  test.should.supportCeqlSearch('name');
});
