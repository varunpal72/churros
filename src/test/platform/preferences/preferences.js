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
    it('should allow a preference to be created or throw a 409 if it exists', () => {
      return cloud.post('/preferences', preference, r => expect(r).to.have.statusCode(409) || expect(r).to.have.statusCode(200));
    });
    it('should allow a preference to be updated', () => {
      return cloud.get('/preferences')
      .then(r => {
        testPreference = r.body.filter(pref=> pref.key === preference.key)[0];
        preferenceId = testPreference.preferencesId;
        isActive = testPreference.active;
      })
      .then(r => cloud.put(`/preferences/${preferenceId}`, Object.assign(testPreference, {active:!isActive})))
      .then(r => expect(r.body.active).to.equal(!isActive));
    });
});
