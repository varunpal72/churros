const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const expect = require('chakram').expect;
const faker = require('faker');
const departmentPayload = tools.requirePayload(`${__dirname}/assets/departments.json`);


suite.forElement('employee', 'departments', (test) => {

  let departmentId;

  before(() => departmentPayload.name = faker.random.word());

  it('Should allow CR for departments', () => {
    return cloud.post(test.api, departmentPayload)
      .then(r =>{
        departmentId = r.body.id;
      })
      .then(r => cloud.get(test.api + '/' + departmentId))
      .then(r => cloud.get(test.api))
      .then(r => expect(r.body).to.not.to.be.empty);
  });
});
