const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;


suite.forElement('employee', 'roles', (test) => {

  test.withApi(test.api)
    .withOptions({ qs: { where: "active='true'" } })
    .withValidation(r => expect(r.body.filter(obj => obj.active !== false)).to.not.be.empty)
    .withName('should allow GET with option active')
    .should.return200OnGet();

  it('Should allow Sr for roles', () => {
    let roleId;
    return cloud.get(test.api)
      .then(r => roleId = r.body[0].id)
      .then(r => cloud.get(test.api + '/' + roleId));
  });
});
