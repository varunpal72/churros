'use strict';

const suite = require('core/suite');
const payload = require('./assets/campaigns');
const cloud = require('core/cloud');

suite.forElement('marketing', 'campaigns', {payload: payload}, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();

  it('should only GET for campaigns/{id}', () => {
    return cloud.post(test.api, payload)
    .then(function(returnVal){
      console.log(returnVal);
    });
    
  });

});
