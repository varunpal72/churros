'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/fields');
const chakram = require('chakram');
const tools = require('core/tools');
const options = {
  churros: {
    updatePayload: {
        caption: "Test PATCH"
    }
  }
};

suite.forElement('crm', 'fields', { payload: payload }, (test) => {
    payload.caption = tools.random();

    test.withName(`should allow CRUDS using PUT for ${test.api}`).should.supportCruds(chakram.put);
    test.withName(`should allow CRUDS using PATCH for ${test.api}`).withOptions(options).should.supportCruds(chakram.patch);
    test.should.supportPagination();

});
