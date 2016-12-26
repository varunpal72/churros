'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('crm', 'emailThreads',null, (test) => {
 
it('should support RS for emailsThreads,GET deals and ', () =>{
let emailThreadId ;  
return cloud.get(`${test.api}`)
	.then(r => emailThreadId =r.body[0].id)
        .then(r => cloud.get(`${test.api}/${emailThreadId}/emails`))
        .then(r => cloud.get(`/hubs/crm/mailMessages/${emailThreadId}`))
        .then(r => cloud.get(`/hubs/crm/deals`))
        .then(r => cloud.withOptions({qs : {folder : "sent" }}).get(`/hubs/crm/mailThreads`));


});
});


