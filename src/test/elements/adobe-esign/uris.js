'use strict';

const suite = require('core/suite');

suite.forElement('esignature', 'uris', {skip: false}, (test) => {
  test.should.return200OnGet();
});
