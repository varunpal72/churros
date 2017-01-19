'use strict';

const suite = require('core/suite');
const chakram = require('chakram');
const payload = require('./assets/opportunities');
const tools = require('core/tools');
const cloud = require('core/cloud');
const build = (overrides) => Object.assign({}, payload, overrides);
const expect = chakram.expect;
const opportunitiesPayload = build({ title: tools.random(), value: tools.randomInt() });



suite.forElement('crm', 'opportunities', { payload: opportunitiesPayload }, (test) => {
  let elements_total_count;


    it('should allow GET of Pipedrive filters', () => {
        return cloud.get('/hubs/crm/filters')
        .then(r => elements_total_count = r.response.headers['elements-returned-count']);

    });



  const options = {
    churros: {
      updatePayload: {
        "title": tools.random(),
        "value": tools.randomInt()
      }
    }
  };
  test.withOptions(options).should.supportCruds(chakram.put);
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'title = \'Demo Deal NEW\'' } }).should.return200OnGet();

  it('Count of Pipedrive filters should remain the same', () => {
      return cloud.get('/hubs/crm/filters')
      .then(r => expect(r.response.headers['elements-returned-count']).to.equal(elements_total_count));


  });


});
