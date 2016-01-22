'use strict';

const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;

var exports = module.exports = {};

exports.for = (hub, objectName, tests) => {
  describe(objectName, () => {
    let api = util.format('/hubs/%s/%s', hub, objectName);
    tests ?
      tests(api) :
      it('add some tests to me!!!', () => {
        return true;
      });
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

const update = (api, id, payload, schema, cb, validationCallback) => {
  cb = (cb || chakram.patch);
  validationCallback = (validationCallback || ((r) => {
    expect(r).to.have.schemaAnd200(schema);
  }));
  return cb(api + '/' + id, payload)
    .then(r => {
      validationCallback(r);
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

const testCrud = (api, payload, schema, updateCallback) => {
  const name = util.format('should allow CRUD for %s', api);
  it(name, () => {
    return crud(api, payload, schema, updateCallback);
  });
};
exports.testCrud = testCrud;

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

const testCruds = (api, payload, schema, updateCallback) => {
  const name = util.format('should allow CRUDS for %s', api);
  it(name, () => {
    return cruds(api, payload, schema, updateCallback);
  });
};
exports.testCruds = testCruds;

const testPaginate = (api, schema, query) => {
  const name = util.format('should allow paginating %s', api);
  api = util.format('%s?page=%s&pageSize=%s', api, 1, 1);
  it(name, () => {
    return find(api, schema);
  });
};
exports.testPaginate = testPaginate;

const testBadGet404 = (api, invalidId) => {
  const name = util.format('should throw a 404 when trying to retrieve a(n) %s that does not exist', api);
  it(name, () => {
    return retrieve(api, (invalidId || -1), null, (r) => {
      expect(r).to.have.statusCode(404);
    });
  });
};
exports.testBadGet404 = testBadGet404;

const testBadPatch404 = (api, payload, invalidId) => {
  const name = util.format('should throw a 404 when trying to update a(n) %s that does not exist', api);
  it(name, () => {
    return update(api, (invalidId || -1), (payload || {}), null, chakram.patch, (r) => {
      expect(r).to.have.statusCode(404);
    });
  });
};
exports.testBadPatch404 = testBadPatch404;

const testBadPost400 = (api, payload) => {
  let name = util.format('should throw a 400 when trying to create a(n) %s with an %s JSON body', api);
  payload ?
    name = util.format(name, 'invalid') :
    name = util.format(name, 'empty');

  it(name, () => {
    return create(api, payload, null, (r) => {
      expect(r).to.have.statusCode(400);
    });
  });
};
exports.testBadPost400 = testBadPost400;
