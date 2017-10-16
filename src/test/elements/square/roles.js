const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const rolePayload = tools.requirePayload(`${__dirname}/assets/rolePayload.json`);
const roleUpdatePayload = tools.requirePayload(`${__dirname}/assets/roleUpdatePayload.json`);

suite.forElement('employee', 'roles', (test) => {

  test.should.supportPagination();

  it('should allow CRUD for roles', () => {
    let roleId, len;

    return cloud.get(test.api)
    .then(r => {
        len = r.body.length;
        paymentId = r.body[len-1].id;
    })
      .then(r => cloud.get(`${test.api}/${roleId}`))
      .then(r => cloud.post(`${test.api}`, rolePayload))
      .then(r => cloud.patch(`${test.api}/${roleId}`, roleUpdatePayload));
  });
});
