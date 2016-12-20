'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');

const productsAttributes = () => ({
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
    "attribute_code": tools.randomStr('abcdefghijklmnopqrstuvwxyz', 8),
    "frontend_input": "text",
    "is_required": true,
    "options": [],
    "is_user_defined": false,
    "default_frontend_label": "Name",
    "backend_type": "varchar",
    "is_unique": "0",
    "frontend_class": "validate-length maximum-length-255",
    "validation_rules": []
  }
});

suite.forElement('ecommerce', 'products-attributes', (test) => {
  it(`should allow CRDS for ${test.api}`, () => {
    let attributeCode;
    return cloud.get(`${test.api}`)
    .then(r => attributeCode = r.body[0].attribute_code)
    .then(r => cloud.crds(`${test.api}`, productsAttributes(attributeCode)));
  });
  test.withApi(`/hubs/ecommerce/products-attributes-types`).should.return200OnGet();
  it(`should allow SR for ${test.api}/{attributeCode}/options`, () => {
    let attributeCode;
    return cloud.get(`${test.api}`)
    .then(r => attributeCode = r.body[0].id)
    .then(r => cloud.get(`${test.api}/${attributeCode}/options`))
    .then(r => cloud.delete(`${test.api}/${attributeCode}`));
  });
});
