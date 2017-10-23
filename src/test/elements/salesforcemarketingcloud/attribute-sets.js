'use strict';
const cloud = require('core/cloud');
const suite = require('core/suite');

suite.forElement('marketing', 'attribute-sets', (test) => {
  it('should allow Sr for /attribute-sets', () => {
    let name;
    return cloud.get(test.api)
      .then(r => name = r.body.items[0].name.value)
      .then(r => cloud.get(`${test.api}/${name}`));
  });
});
