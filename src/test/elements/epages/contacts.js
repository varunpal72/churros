'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/contacts');

suite.forElement('ecommerce', 'contacts', { payload: payload }, (test) => {
  it(`should allow RU for ${test.api}`, () => {
    return cloud.get(test.api)
      .then(r => cloud.withOptions({ qs: { locale: 'en_US' } }).put(test.api, payload));
  });
});