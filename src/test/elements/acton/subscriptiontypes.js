'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
  suite.forElement('marketing', 'subscription-types', {skip: true}, (test) => {
    it('it should support Adding,Removing records from a subscription type by email address', () => {
       return cloud.get(test.api)
       .then(r => cloud.patch(`${test.api}/Newsletter/optin/test%40gmail.com`))
       .then(r => cloud.patch(`${test.api}/Newsletter/optout/test%40gmail.com`));
    });
});
