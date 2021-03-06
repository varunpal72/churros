'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const provisioner = require('core/provisioner');
const jdbcElementJson = require('./assets/jdbc/jdbc_element.json');

const maxRows = 50;
const extraRows = maxRows + maxRows;

suite.forPlatform('element-jdbc', {}, (test) => {
  let jdbcElement;
  let jdbcInstance;
  before(() => cloud.post('elements', jdbcElementJson)
    .then(r => jdbcElement = r.body)
    .then(r => provisioner.create('elementjdbc', undefined, 'elements/elementjdbc/instances'))
    .then(r => jdbcInstance = r.body));

  it(`it should fail to retrieve more than ${maxRows} rows`, () => {
    //upload 70 contacts
    return cloud.post(`/hubs/general/Contacts/multiple?rows=${extraRows}`)
      .then(r => {
        expect(r.body.count).to.equal(extraRows);
      })
      .then(r => cloud.get('/hubs/general/Contacts', r => {
        expect(r).to.have.statusCode(200);
        expect(r.body.length).to.be.equal(maxRows);
      }))
      .then(r => cloud.get('/hubs/general/Contacts/count', r => {
        expect(r).to.have.statusCode(200);
        expect(r.body[0].total_rows).to.be.equal(extraRows);
      }))
      .then(r => cloud.delete('/hubs/general/Contacts', r => {
        expect(r.body.count).to.equal(extraRows);
        expect(r).to.have.statusCode(200);
      }));
  });

  after(() => {
    return provisioner.delete(jdbcInstance.id, 'elements/elementjdbc/instances')
      .then(r => cloud.delete(`elements/${jdbcElement.id}`));
  });
});
