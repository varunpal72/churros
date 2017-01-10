'use strict';

const cloud = require('core/cloud');
const suite = require('core/suite');
const tools = require('core/tools');
const chakram = require('chakram');
const expect = chakram.expect;

const objects = require('./assets/objects');

suite.forPlatform('organizations/objects/definitions', {payload: objects}, (test) => {

it('Should support POST', () => {
    return cloud.post('/organizations/objects/definitions', objects, (r) => {
      console.log(r.response.statusCode);
      if(r.response.statusCode===409)
      {
        let object1 = 'ChurrosOrgObjectTestContact1235678';
        let object2 = 'ChurrosOrgObjectTestAccount12334563657';
        cloud.delete(`/organizations/objects/${object1}/definitions`), (r) => (true);
        cloud.delete(`/organizations/objects/${object2}/definitions`), (r) => (true);

        return cloud.post('/organizations/objects/definitions', objects, (r) => console.log(r));

      } else if (r.response.statusCode===200) {
        return true;
      }
        else {
          return false;
      }
    });
});

xit('Should return 200 if all objects are deleted or 409 if no objects are deleted because of existing transformations', () => {
     return cloud.delete('/organizations/objects/definitions', (r) => {
      if(r.statusCode===200 || r.statusCode===409)
      {
        return true;
      }  else
      {
        return false;
      }
    });
  });

});
