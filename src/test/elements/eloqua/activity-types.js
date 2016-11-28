'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('marketing', 'activity-types', null, (test) => {
    it('should allow ping for eloqua' , () => {
    return cloud.get(`/hubs/marketing/ping`);
    });
    
    test.should.return200OnGet();
});
