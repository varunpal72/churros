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
const productsAttributesSetsPatch = (attributeSetId) => ({
  "attributeSet": {
    "attribute_set_name": tools.random(),
    "sort_order": 2,
    "entity_type_id":attributeSetId
  }
});
const productsAttributeSetsGroupsPost = (attributeSetId, attributeGroupId) => ({
  "group": {
    "attribute_group_id": attributeGroupId,
    "attribute_group_name": tools.random(),
    "attribute_set_id": attributeSetId
  }
});
const productsAttributeSetsGroupsPatch = (attributeGroupId) => ({
  "group": {
    "attribute_group_id": attributeGroupId,
    "attribute_group_name": tools.random()
  }
});
const productsAttributesSetsAttributes = (attributeSetId, attributeGroupId, attributeCode) => ({
  "attributeSetId": attributeSetId,
  "attributeGroupId": attributeGroupId,
  "attributeCode": attributeCode,
  "sortOrder": 0
});

suite.forElement('ecommerce', 'products-attribute-sets', (test) => {
  it(`should allow CRDS for ${test.api}`, () => {
    let attributeSetId;
    return cloud.get(`${test.api}`)
      .then(r => attributeSetId = r.body[0].id)
      .then(r => cloud.crds(`${test.api}`, productsAttributesSets(attributeSetId)))
  });
  it(`should allow GET for /hubs/ecommerce/products-attribute-sets-groups`, () => {
    let attributeSetId;
    return cloud.get(`${test.api}`)
      .then(r => attributeSetId = r.body[0].id)
      .then(r => cloud.withOptions({ qs: { where: `attribute_set_id = ${attributeSetId}` } }).get(`/hubs/ecommerce/products-attribute-sets-groups`));
    });
});
