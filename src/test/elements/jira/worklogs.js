'use strict';

const suite = require('core/suite');

suite.forElement('helpdesk', 'worklogs', (test) => {
 
test.withOptions({ qs: { where: `updated='true'` }}).should.supportS();

})
