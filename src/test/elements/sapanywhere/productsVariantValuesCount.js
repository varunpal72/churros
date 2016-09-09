'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');


suite.forElement('ecommerce', 'products/variant-values/count', null, (test) => {

  it('should get the count of the variant-values', () => {
    test.withApi(test.api + '/variant-values/count').should.return200OnGet();

  });
});
