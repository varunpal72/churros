'use strict';

const suite = require('core/suite');
const schema = require('./assets/objects.schema.json');

suite.forElement('ocr', 'objects', null, (test) => {
  test.withValidation(schema).should.return200OnGet();
});
