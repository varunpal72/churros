'use strict';

const suite = require('core/suite');


suite.forElement('ecommerce', 'products/variant-values/count', null, (test) => {

  it('should get the count of the variant-values', () => {
    test.withApi(test.api + '/variant-values/count').should.return200OnGet();

  });
});
