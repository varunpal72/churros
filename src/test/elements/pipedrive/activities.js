'use strict';

const suite = require('core/suite');
const chakram = require('chakram');
const payload = require('./assets/activities');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const activitiesPayload = build({ subject: tools.random() });

suite.forElement('crm', 'activities', { payload: activitiesPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "subject": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds(chakram.put);
  test.should.supportPagination();
});
