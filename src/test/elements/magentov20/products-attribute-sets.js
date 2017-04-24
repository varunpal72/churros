
'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const expect = require('chakram').expect;

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
 let attributeSetId,attributeSetName,groupId;

  it(`should allow CRDS for ${test.api}`, () => {
    return cloud.crds(`${test.api}`, productsAttributesSets());
  });

  it(`should allow PATCH for ${test.api} and should allow GET for ${test.api}/{attributeSetId}/attributes`, () => {
    return cloud.get(`${test.api}`)
      .then(r =>{ attributeSetId = r.body[0].id;
                    attributeSetName = r.body[0].attribute_set_name;})
      .then(r => cloud.patch(`${test.api}/${attributeSetId}`, updateProductsAttributesSets(attributeSetId)))
      .then(r => cloud.get(`${test.api}/${attributeSetId}/attributes`));
  });
  it.skip(`should support searching ${test.api} by attribute_set_name`, () => { //where clause donot work
    return cloud.get(`${test.api}`)
      .then(r =>{ attributeSetId = r.body[0].id;
                    attributeSetName = r.body[0].attribute_set_name;})
      .then(r => {cloud.withOptions({ qs: { where: `attribute_set_name='${attributeSetName}'`} }).get(test.api)
                  expect(r).to.have.statusCode(200);
                  const validValues = r.body.filter(obj => obj.attribute_set_name === `'${attributeSetName}'`);
                  expect(validValues.length).to.equal(r.body.length);
      })
  });

  it.skip(`should allow DELETE for  ${test.api}/{attributeSetId}/attributes/{attributeCode}`, () => { //System attributes can not be deleted
    return cloud.get(`${test.api}`)
      .then(r => attributeSetId = r.body[0].id)
      .then(r => cloud.get(`/hubs/ecommerce/products-attributes`))
      .then(r => attributeCode = r.body[0].id)
      .then(r => cloud.delete(`${test.api}/${attributeSetId}/attributes/${attributeCode}`));
      })

  it(`should allow CRD for /hubs/ecommerce/products-attribute-sets-groups`, () => {
    return cloud.get(`${test.api}`)
      .then(r => attributeSetId = r.body[0].id)
      .then(r => cloud.post(`/hubs/ecommerce/products-attribute-sets-groups`,ProductsAttributesSetsGroup(attributeSetId)))
      .then(r => groupId = r.body.attribute_group_id)
      .then(r => cloud.delete(`/hubs/ecommerce/products-attribute-sets-groups/${groupId}`));
    });
    test
     .withName(`should support searching /hubs/ecommerce/products-attribute-sets-groups by attribute_set_id`)
     .withOptions({ qs: { where: `attribute_set_id=21`} })
     .withApi(`/hubs/ecommerce/products-attribute-sets-groups`)
     .withValidation((r) => {
     expect(r).to.have.statusCode(200);
     const validValues = r.body.filter(obj => obj.attribute_set_id === 21);
     expect(validValues.length).to.equal(r.body.length);
     }).should.return200OnGet();

    it(`should allow POST for /hubs/ecommerce/products-attribute-sets-attributes`, () => {
      let attributeCode;
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
      });

      it.skip(`should allow PATCH for  ${test.api}/{attributeSetId}/group/{groupId}`, () => { //Error in plateform API
        return cloud.get(`${test.api}`)
          .then(r => attributeSetId = r.body[0].id)
          .then(r => cloud.post(`/hubs/ecommerce/products-attribute-sets-groups`,ProductsAttributesSetsGroup(attributeSetId)))
          .then(r => groupId = r.body.attribute_group_id)
          .then(r => cloud.patch(`${test.api}/${attributeSetId}/group/${groupId}`))
          .then(r => cloud.delete(`/hubs/ecommerce/products-attribute-sets-groups/${groupId}`));
        });
});
