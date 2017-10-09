const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const rolePayload = tools.requirePayload(`${__dirname}/assets/rolePayload.json`);
const roleUpdatePayload = tools.requirePayload(`${__dirname}/assets/roleUpdatePayload.json`);

suite.forElement('employee', 'roles', (test) => {

  test.should.supportPagination();

  it('should allow CRUD for roles', () => {
    let id = 'j1YRWVF7zBl9RzbFA0mC';

    return cloud.get(test.api)
      .then(r => cloud.get(`${test.api}/${id}`))
      .then(r => cloud.post(`${test.api}`, rolePayload))
      .then(r => cloud.patch(`${test.api}/${id}`, roleUpdatePayload));
  });
});
