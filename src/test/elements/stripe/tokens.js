'use strict';

const suite = require('core/suite');

/* Commenting out the POST of Tokens as it creates a new Token ID everytime and there is no way to delete it.
//So, the value of tokenID has been hardcoded
const cloud = require('core/cloud');
const payload = require('./assets/tokens');

suite.forElement('payment', 'tokens', { payload:payload }, (test) => {
  it(`should allow CR for ${test.api}/{tokenId}`, () => {
    let tokenId;
    return cloud.post(`${test.api}`, payload)
      .then(r => tokenId = r.body.id)
      .then(r => cloud.get(`${test.api}/${tokenId}`));
  });
});
*/
suite.forElement('payment', 'tokens', (test) => {
  let tokenId = 'tok_182kUjGdZbyQGmEeaRuzEj4F';
  test.withApi(`${test.api}/${tokenId}`).should.return200OnGet();
});
