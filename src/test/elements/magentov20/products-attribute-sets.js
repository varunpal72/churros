'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');

const productsAttributesSets = (attributeSetId) => ({
  "attributeSet": {
    "attribute_set_name": tools.random(),
    "sort_order": 2,
    "entity_type_id":attributeSetId
  },
  "skeletonId": attributeSetId
});
suite.forElement('ecommerce', 'products-attribute-sets', (test) => {
  it(`should allow CRDS for ${test.api}`, () => {
    let attributeSetId;
    return cloud.get(`${test.api}`)
      .then(r => attributeSetId = r.body[0].id)
      .then(r => cloud.crds(`${test.api}`, productsAttributesSets(attributeSetId)));
  });
  it(`should allow GET for /hubs/ecommerce/products-attribute-sets-groups`, () => {
    let attributeSetId;
    return cloud.get(`${test.api}`)
      .then(r => attributeSetId = r.body[0].id)
      .then(r => cloud.withOptions({ qs: { where: `attribute_set_id = ${attributeSetId}` } }).get(`/hubs/ecommerce/products-attribute-sets-groups`));
    });
});
