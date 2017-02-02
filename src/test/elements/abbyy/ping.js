'use strict';

const suite = require('core/suite');

suite.forElement('ocr', 'ping', null, (test) => {
  test.should.return200OnGet();
});
