'use strict';

const suite = require('core/suite');
const chakram = require('chakram');
const cloud = require('core/cloud');
const expect = chakram.expect;



suite.forElement('crm', 'filters', (test) => {
  let elements_total_count;


    it('compare of pipedrive filters before and after get call', () => {
      return cloud.get('/hubs/crm/filters')
        .then(r => elements_total_count = r.response.headers['elements-returned-count'])
        .then(r => cloud.withOptions({ qs: { where: 'id = \'2171\'' } }).get('/hubs/crm/opportunities'))
        .then(r => cloud.get('/hubs/crm/filters'))
        .then(r => expect(r.response.headers['elements-returned-count']).to.equal(elements_total_count));


  });


});
