'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const expect = require('chakram').expect;
const productsAttributes = require(`./assets/products-attributes`);
const optionsPayload = () => ({
  "option": {
    "label": "number",
    "value": 1,
    "isDefault": true,
    "storeLabels": [{
      "label": "number"
    }]
  }
});

suite.forElement('ecommerce', 'products-attributes', { payload: productsAttributes }, (test) => {
  let frontendInput, attributeCode = "code" + tools.randomInt();
  productsAttributes.attribute.default_frontend_label = "label" + tools.randomInt();
  productsAttributes.attribute.attribute_code = attributeCode;
  it(`should allow CRDS for ${test.api}`, () => {
    return cloud.post(`${test.api}`, productsAttributes)
      .then(r => frontendInput = r.body.frontend_input)
      .then(r => cloud.withOptions({ qs: { where: `frontend_input=${frontendInput}` } }).get(`${test.api}`))
      .then(r => cloud.get(`${test.api}/${attributeCode}`))
      .then(r => cloud.delete(`${test.api}/${attributeCode}`));
  });

  test
    .withName(`should support searching ${test.api} by frontend_input`)
    .withOptions({ qs: { where: `frontend_input='${frontendInput}'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.frontend_input === frontendInput);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();

  it(`should allow PUT for ${test.api}`, () => {
    return cloud.put(`${test.api}/${attributeCode}`, productsAttributes)
      .then(r => cloud.delete(`${test.api}/${attributeCode}`));
  });

  test.withApi(`/hubs/ecommerce/products-attributes-types`).should.return200OnGet();
  it(`should allow CR for ${test.api}/attributeCode/options`, () => {
    let attributeCode = "color",
      optionId;
    return cloud.post(`${test.api}/${attributeCode}/options`, optionsPayload())
      .then(r => cloud.get(`${test.api}/${attributeCode}/options`))
      .then(r => {
        if (r.body.id) {
          return;
        } else {
          optionId = r.body.id;
          return cloud.get(`${test.api}/${attributeCode}/options`);
        }
      });
  });
  test.should.supportPagination();
});
