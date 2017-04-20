'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');

const productsAttributes = (attributeCode) => ({
  "attribute": {
    "is_wysiwyg_enabled": false,
    "is_html_allowed_on_front": false,
    "used_for_sort_by": true,
    "is_filterable": false,
    "is_filterable_in_search": false,
    "is_used_in_grid": false,
    "is_visible_in_grid": false,
    "is_filterable_in_grid": false,
    "position": 0,
    "apply_to": [],
    "is_searchable": "1",
    "is_visible_in_advanced_search": "1",
    "is_comparable": "0",
    "is_used_for_promo_rules": "0",
    "is_visible_on_front": "0",
    "used_in_product_listing": "1",
    "is_visible": true,
    "scope": "store",
    "attribute_code":attributeCode ,
    "frontend_input": "text",
    "is_required": true,
    "options": [
      {
        "label": "Yes",
        "value": "1"
      }
    ],
    "is_user_defined": false,
    "default_frontend_label": "label" + tools.randomInt(),
    "backend_type": "varchar",
    "is_unique": "0",
    "frontend_class": "validate-length maximum-length-255",
    "validation_rules": []
  }
});
const optionsPayload = () => ({
    "option": {
      "label": "number",
      "value": 1,
      "isDefault": true,
      "storeLabels": [
        {
          "label": "number"
        }]}
  });

suite.forElement('ecommerce', 'products-attributes', { payload: productsAttributes() },  (test) => {
  let attributeCode= "code" + tools.randomInt();
  it(`should allow CRDS for ${test.api}`, () => {
    let frontendInput;
    return cloud.post(`${test.api}`, productsAttributes(attributeCode))
    .then(r =>frontendInput = r.body.frontend_input)
    .then(r => cloud.withOptions({ qs: { where: `frontend_input=${frontendInput}` } }).get(`${test.api}`))
    .then(r => cloud.get(`${test.api}/${attributeCode}`))
    .then(r => cloud.delete(`${test.api}/${attributeCode}`));
  });
  it(`should allow PUT for ${test.api}`, () => {
    return cloud.put(`${test.api}/${attributeCode}`,productsAttributes(attributeCode))
    .then(r => cloud.delete(`${test.api}/${attributeCode}`));
  });
  test.withApi(`/hubs/ecommerce/products-attributes-types`).should.return200OnGet();
  it(`should allow CR for ${test.api}/attributeCode/options`, () => {
    let attributeCode = "color";
    return cloud.post(`${test.api}/${attributeCode}/options`,optionsPayload())
    .then(r => cloud.get(`${test.api}/${attributeCode}/options`));
  //  .then(r => optionId = r.body.id)                                    no id generated after POST, so code is commented
  //  .then(r => cloud.get(`${test.api}/${attributeCode}/options`))
  });
  test.should.supportPagination();
});
