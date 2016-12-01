'use strict';

const suite = require('core/suite');
const chakram = require('chakram');
const payload = require('./assets/opportunities');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const opportunitiesPayload = build({ title: tools.random(), value: tools.randomInt() });

suite.forElement('crm', 'opportunities', { payload: opportunitiesPayload, skip: false }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "title": tools.random(),
        "value": tools.randomInt()
      }
    }
  };
  test.withOptions(options).should.supportCruds(chakram.put);
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'title = \'Demo Deal NEW\'' } }).should.return200OnGet();
});
