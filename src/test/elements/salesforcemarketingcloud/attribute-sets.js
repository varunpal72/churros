'use strict';
const cloud = require('core/cloud');
const suite = require('core/suite');
//
// suite.forElement('marketing', 'attribute-sets', (test) => {
//   test.should.return200OnGet()
// });

suite.forElement('marketing', 'attribute-sets', (test) => {
it('should allow R for /data-events', () => {
let name;
  return cloud.get(test.api)
  .then(r => cloud.get(`${test.api}/${name}`));
});
});
