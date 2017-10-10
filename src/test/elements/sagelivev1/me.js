'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

 suite.forElement('finance', 'me', (test) => {
     it(`should support GET ${test.api}`, () => {
       return cloud.get(`${test.api}/chatter-profiles`)
         .then(r=> cloud.get(`${test.api}/organizations`))
         .then(r=> cloud.get(`${test.api}/permission-sets`))
         .then(r=> cloud.get(`${test.api}/services`));
       });
   });
