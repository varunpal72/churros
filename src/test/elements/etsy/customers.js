//Cannot get customer ID because of issues with Orders API call >>> returning Access Denied
'use strict';

const suite = require('core/suite');
// const payload = require('./assets/orders');
// const cloud = require('core/cloud');

suite.forElement('ecommerce', 'customers', {}, (test) => {
  // checkout functions available under test.should which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite
 
  // it('should GET customer by ID', () => {
  // });
});
