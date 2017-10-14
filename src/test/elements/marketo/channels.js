'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

// suite.forElement('marketing', 'channels', (test) => {
//   let name, value;
//   it('should allow SR for /channels', () => {
//     return cloud.get(`${test.api}`)
//     .then(r => name = r.body[0].name)
//     .then(r => value = `name in ( ${name} )`)
//     .then(r => cloud.withOptions({ qs: { where: `${value}` } }).get(`${test.api}`))
//   });
// });

suite.forElement('marketing', 'channels', (test) => {
  test.should.supportSr();
});
