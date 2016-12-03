'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/contacts');

suite.forElement('ecommerce', 'contacts', { payload: payload }, (test) => {
  it(`should allow SU for ${test.api}`, () => {
    return cloud.get(test.api)
      .then(r => cloud.withOptions({ qs: { locale: 'en_US' } }).put(test.api, payload));
  });
});