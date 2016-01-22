'use strict';

const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;

var exports = module.exports = {};

exports.for = (hub, objectName, tests) => {
  describe(objectName, () => {
    let api = util.format('/hubs/%s/%s', hub, objectName);
    tests(api);
  });
};

const create = (api, payload, schema, validationCallback) => {
  validationCallback = (validationCallback || ((r) => {
    expect(r).to.have.schemaAnd200(schema);
  }));

  return chakram.post(api, payload)
    .then(r => {
      validationCallback(r);
      return r;
    })
    .catch(r => {
      console.log('Failed to create %s with payload %s', api, JSON.stringify(payload));
      console.log(r);
    });
};

const retrieve = (api, id, schema, validationCallback) => {
  validationCallback = (validationCallback || ((r) => {
    expect(r).to.have.schemaAnd200(schema);
  }));
  return chakram.get(api + '/' + id)
    .then(r => {
      validationCallback(r);
      return r;
    })
    .catch(r => {
      console.log('Failed to retrieve %s with ID %s', api, id);
      console.log(r);
    });
};

const update = (api, id, payload, schema, cb) => {
  cb = (cb || chakram.patch);
  return cb(api + '/' + id, payload)
    .then(r => {
      expect(r).to.have.schemaAnd200(schema);
      return r;
    })
    .catch(r => {
      console.log('Failed to update %s with ID %s', api, id);
      console.log(r);
    });
};

const remove = (api, id) => {
  return chakram.delete(api + '/' + id)
    .then(r => {
      expect(r).to.have.statusCode(200);
      return r;
    })
    .catch(r => {
      console.log('Failed to delete %s with ID %s', api, id);
      console.log(r);
    });
};

const find = (api, schema, validationCallback) => {
  validationCallback = (validationCallback || ((r) => {
    expect(r).to.have.schemaAnd200(schema);
  }));
  return chakram.get(api)
    .then(r => {
      validationCallback(r);
      return r;
    });
};

const crud = (api, payload, schema, updateCallback) => {
  return create(api, payload, schema)
    .then(r => {
      return retrieve(api, r.body.id, schema);
    })
    .then(r => {
      return update(api, r.body.id, payload, schema, updateCallback);
    })
    .then(r => {
      return remove(api, r.body.id);
    });
};
exports.crud = crud;

const cruds = (api, payload, schema, updateCallback) => {
  let createdId = -1;
  return create(api, payload, schema)
    .then(r => {
      createdId = r.body.id;
      return retrieve(api, createdId, schema);
    })
    .then(r => {
      return update(api, createdId, payload, schema, updateCallback);
    })
    .then(r => {
      return find(api, schema);
    })
    .then(r => {
      return remove(api, createdId);
    });
};
exports.cruds = cruds;

const testCrud = (api, payload, schema, updateCallback) => {
  const name = util.format('should allow creating, retrieving, updating and deleting a %s', api);
  it(name, () => {
    return crud(api, payload, schema, updateCallback);
  });
};
exports.testCrud = testCrud;

const test404 = (api, invalidId) => {
  const name = util.format('should throw a 404 when trying to retrieve a(n) %s that does not exist', api);
  it(name, () => {
    return retrieve(api, (invalidId || -1), null, (r) => {
      expect(r).to.have.statusCode(404);
    });
  });
};
exports.test404 = test404;

const testBadPost400 = (api, payload) => {
  const name = util.format('should throw a 400 when trying to create a(n) %s with an invalid JSON body', api);
  it(name, () => {
    return create(api, payload, null, (r) => {
      expect(r).to.have.statusCode(400);
    });
  });
};
exports.testBadPost400 = testBadPost400;
