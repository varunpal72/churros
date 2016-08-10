'use strict';

const suite = require('core/suite');
const schema = require('./assets/info.schema.json');

suite.forElement('ocr', 'info', null, (test) => {
  test.withValidation(schema).should.return200OnGet();
});
