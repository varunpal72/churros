'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/messages');

suite.forElement('messaging', 'messages', {payload: payload}, (test) => {
  test.should.return200OnGet();
  test.should.supportPagination();

  //SKIPPING TEST UNTIL WE LIMIT THE AMOUNT OF CALLS WE MAKE
  //TO CREATE MESSAGES IN TWILIO TO KEEP COSTS DOWN.
  it.skip('should allow Create and Read', () => {
    let MessageSID;
    let MediaSID;
    return cloud.post('/hubs/messaging/messages', payload)
      .then(r => MessageSID = r.body.sid)
      .then(r => cloud.get('/hubs/messaging/messages/' + MessageSID))
      .then(r => cloud.get('/hubs/messaging/messages/' + MessageSID + '/media'))
      .then(r => MediaSID = r.body[0].sid)
      .then(r => cloud.get('/hubs/messaging/messages/' + MessageSID + '/media/' + MediaSID))
  });
});
