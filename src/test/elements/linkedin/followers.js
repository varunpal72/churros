'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('social', 'followers',{skip: true}, (test) => {
  it('should allow get all followers', () => {
    return cloud.get(`/hubs/social/companies/16238355/followers`);
  });
});
