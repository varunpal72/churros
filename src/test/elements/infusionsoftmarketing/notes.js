'use strict';

const suite = require('core/suite');
const payload = require('./assets/notes');

suite.forElement('marketing', 'notes', { payload: payload }, (test) => {
  test.should.supportCrud();
  test.withOptions({ qs: { where: 'ObjectType = \'Note\'' } }).should.return200OnGet();
});
