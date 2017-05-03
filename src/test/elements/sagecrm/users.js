'use strict';

const suite = require('core/suite');

suite.forElement('crm', 'users', null, (test) => {
    test.should.supportSr(); 
    test.should.supportPagination();
    test.withName(`should support searching ${test.api} by Opportunity status`).withOptions({ qs: { where: `user_title ='Test'` } }).should.return200OnGet();  

});
