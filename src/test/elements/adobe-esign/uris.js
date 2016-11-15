'use strict';

const suite = require('core/suite');

suite.forElement('esignature', 'uris', {skip: true}, (test) => {
  test.should.return200OnGet();
});
