'use strict';

const cloud = require('core/cloud');
const logger = require('winston');

var exports = module.exports = {};

/**
 * Validator that validates absolutely nothing
 */
const ignore = (response) => {
  logger.debug(`Ignoring HTTP response`);
  return response;
};

/**
 * Slowly deletes things as opposed to doing them all at once, which can be painful
 */
const deleteAll = (resource, ids) => {
  if (!ids || ids.length <= 0) return;
  logger.debug(`Attempting to delete ${resource} with id ${ids[0]}`);
  return cloud.delete(`/${resource}/${ids[0]}`, ignore)
    .then(r => ids.shift())
    .then(r => deleteAll(resource, ids));
};

/**
 * Cleans all formulas and formula instances based on a given field
 */
const cleanFormulas = (field, values) => {
  logger.debug(`Cleaning formulas where ${field} is set to one of ${values}`);
  return cloud.get(`/formulas`)
    .then(rs => rs.body.filter(r => {
      let isFound = false;
      values.forEach(value => isFound = isFound || r[field] === value);
      return isFound;
    }))
    .then(rs => {
      return Promise.all(rs.map(r => cloud.get(`/formulas/${r.id}/instances`)))
        .then(rs => {
          // concat them all together
          let instances = [];
          rs.map(r => instances = instances.concat(r.body));
          return instances;
        })
        .then(rs => Promise.all(rs.map(r => cloud.delete(`/formulas/${r.formula.id}/instances/${r.id}`))))
        .then(() => Promise.all(rs.map(f => cloud.delete(`/formulas/${f.id}`))));
    });
};

const cleanElements = (field, value) => {
  logger.debug(`Cleaning elements where ${field} is set to ${value}`);
  return cloud.get(`/instances`)
    .then(rs => rs.body.filter(r => r[field] === value))
    .then(rs => deleteAll('instances', rs.map(r => r.id)))
    .catch(r => logger.debug(`Poop: ${r}`));
};

/**
 * Clean up resources with a given field
 */
exports.formulas = {
  withName: (name) => {
    return cleanFormulas('name', [name]);
  },
  withNames: (names) => {
    return cleanFormulas('name', names);
  }
};

exports.elements = {
  withName: (name) => {
    return cleanElements('name', name);
  }
};
