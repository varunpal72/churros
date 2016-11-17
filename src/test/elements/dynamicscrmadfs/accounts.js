'use strict';

const suite = require('core/suite');
const payload = require('./assets/accounts');
const tools = require('core/tools');
const cloud = require('core/cloud');
const build = (overrides) => Object.assign({}, payload, overrides);
const accountsPayload = build({ name: tools.random()});

suite.forElement('crm', 'accounts', { payload:accountsPayload }, (test) => {
  const options = {
      churros: {
          updatePayload: {
              "name": tools.random()
          }
      }
  };
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  let id;
  return cloud.get(test.api)
      .then(r => id = r.body[0].id)
      .then(r => cloud.get(`${test.api}`),{ qs: { where:'id="${id}"' } });
});
