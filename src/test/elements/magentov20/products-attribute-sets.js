
'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');

const productsAttributesSets = () => ({
  "attributeSet": {
    "attribute_set_name": "attributeName" + tools.randomInt(),
    "sort_order": 2,
    "entity_type_id":4
  },
  "skeletonId": 4
});
const updateProductsAttributesSets = (attributeSetId) => ({
  "attribute_set_name":  "attributeName" + tools.randomInt(),
  "attribute_set_id": attributeSetId,
  "entity_type_id": 4,
  "sort_order": 1
});
const ProductsAttributesSetsGroup = (attributeSetId) => ({
    "group": {
      "attribute_group_name":  "groupName" + tools.randomInt(),
      "attribute_set_id": attributeSetId
    }
});
const ProductsAttributesSetsAttribute = () => ({
"attribute_set_id": 4,
"attribute_group_id": 7,
"attribute_code": "name",
"sortOrder": 0
});

suite.forElement('ecommerce', 'products-attribute-sets', (test) => {

  it(`should allow CRDS for ${test.api}`, () => {
    return cloud.crds(`${test.api}`, productsAttributesSets());
  });
  it(`should allow PATCH for ${test.api}`, () => {
    let attributeSetId,attributeSetName;
    return cloud.get(`${test.api}`)
        .then(r =>{ attributeSetId = r.body[0].id;
                    attributeSetName = r.body[0].attribute_set_name;})
        .then(r => cloud.withOptions({ qs: { where: `attribute_set_name='${attributeSetName}'` } }).get(`${test.api}`))
        .then(r => cloud.patch(`${test.api}/${attributeSetId}`, updateProductsAttributesSets(attributeSetId)));
  });
  it(`should allow CRD for /hubs/ecommerce/products-attribute-sets-groups`, () => {
    let attributeSetId,groupId;
    return cloud.get(`${test.api}`)
      .then(r => attributeSetId = r.body[0].id)
      .then(r => cloud.withOptions({ qs: { where: `attribute_set_id = ${attributeSetId}` } }).get(`/hubs/ecommerce/products-attribute-sets-groups`))
      .then(r => cloud.post(`/hubs/ecommerce/products-attribute-sets-groups`,ProductsAttributesSetsGroup(attributeSetId)))
      .then(r => groupId = r.body.attribute_group_id)
      .then(r => cloud.delete(`/hubs/ecommerce/products-attribute-sets-groups/${groupId}`));
    });
    it(`should allow POST for /hubs/ecommerce/products-attribute-sets-attributes`, () => {
      let attributeSetId,groupId,attributeCode,attributeSetattributeId;
      return cloud.get(`${test.api}`)
        .then(r => attributeSetId = r.body[0].id)
        .then(r => cloud.get(`/hubs/ecommerce/products-attributes`))
        .then(r => attributeCode = r.body[0].id)
        .then(r => cloud.post(`/hubs/ecommerce/products-attribute-sets-groups`,ProductsAttributesSetsGroup(attributeSetId)))
        .then(r => groupId = r.body.attribute_group_id)
        .then(r => {
           ProductsAttributesSetsAttribute.attribute_set_id = attributeSetId;
           ProductsAttributesSetsAttribute.attribute_group_id = groupId;
           ProductsAttributesSetsAttribute.attribute_code = attributeCode;
          })
        .then(r => cloud.post(`/hubs/ecommerce/products-attribute-sets-attributes`,ProductsAttributesSetsAttribute()))
        .then(r => attributeSetattributeId = r.body.attribute_sets_attribute_id)
        .then(r => cloud.withOptions({ qs: { where: `attribute_set_id = ${attributeSetId}` } }).get(`/hubs/ecommerce/products-attribute-sets/${attributeSetId}/attributes`));
      });
        test.should.supportPagination();
});
