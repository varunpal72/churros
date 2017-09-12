'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;
const user = require('./assets/user.json');

let token;
before(() => cloud.post('/signup', user, (r) => {}));
suite.forPlatform('authentication', (test) => {
  it('should support authentication for normal users with token', () => {
      return cloud.post('/authentication', user)
      .then(r => {
        token = r.body.token;
        expect(r.body.twoFactor).to.be.false;
        expect(r.body.registeredForTwoFactor).to.be.false;
    });
      //return request({uri: baseUrl + '/authentication', body: user, method:'POST', json: true}); 
    });
  it('should be able to call authenticated endpoint with token if not two factor', () => {
    return cloud.withOptions({ headers: {Authorization: 'Bearer ' + token}}).get('/instances', (r) => expect(r).to.have.statusCode(404));

  });

});
