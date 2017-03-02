'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
// const payload = require('./assets/users');
// const contactPayload = require('./assets/contacts');
// const tools = require('core/tools');
// const build = (overrides) => Object.assign({}, payload, overrides);

suite.forElement('crm', 'users', { skip: false}, (test) => {
    test.should.supportSr();
    test.should.supportPagination();
    it('should support where for /hubs/crm/users', () => {
      let locationID;
      return cloud.get(test.api)
        .then(r => locationID = r.body[0].locationID)
        .then(r => cloud.withOptions({qs: {where: 'locationID=\'' + locationID + '\''}}).get(test.api));
    });
    // it(`should support CRUS, pagination and where for /hubs/crm/users`, () => {
    // let userId;
    // return cloud.post(test.api, payload)
    //   .then(r => {
    //     console.log(r);
    //     userId = r.body.id;
    //   })
    //   .then(r => cloud.get(`${test.api}/${userId}`))
    //   .then(r => cloud.patch(`${test.api}/${userId}`, payload))
    //   .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
    //   .then(r => cloud.withOptions({ qs: { where: 'userName=\'mrchurros@cloud-elements.com\'' } }).get(test.api));
    // });
});
