'use strict';

const chakram = require('chakram');
const props = require('core/util/properties');
const util = require('util');

var exports = module.exports = {};

exports.setup = (token) => {
  const url = props.get('url');
  const us = props.get('user.secret');
  const os = props.get('org.secret');

  if (token)
    chakram.setRequestDefaults({
      baseUrl: url + '/elements/api-v2',
      headers: { Authorization: util.format('User %s, Organization %s, Element %s', us, os, token) }
    });
  else
    chakram.setRequestDefaults({
      baseUrl: url + '/elements/api-v2',
      headers: { Authorization: util.format('User %s, Organization %s', us, os) }
    });
};
