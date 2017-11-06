'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const swaggerParser = require('swagger-parser');
const expect = require('chakram').expect;
const preference = require('./assets/preference');

suite.forPlatform('preferences', preference, (test) => {
    let preferenceId;
    let isActive;
    let testPreference;
    before(() => cloud.post('/preferences', preference, r => Promise.resolve(true)));
    it('creating a preference that exists should throw a 409', () => {
      return cloud.post('/preferences', preference, r => expect(r).to.have.statusCode(409));
    });
    it('should allow a preference to be updated', () => {
      return cloud.get('/preferences')
      .then(r => {
        testPreference = r.body.filter(pref=> pref.key === preference.key)[0];
        preferenceId = testPreference.preferenceId;
        isActive = testPreference.active;
      })
      .then(r => cloud.put(`/preferences/${preferenceId}`, Object.assign(testPreference, {active:!isActive})))
      .then(r => expect(r.body.active).to.equal(!isActive));
    });
});
