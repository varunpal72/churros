'use strict';

const suite = require('core/suite');
const payload = require('./assets/messages');
const cloud = require('core/cloud');

suite.forElement('collaboration', 'messages', payload, (test) => {
  // check for create success
  it('should support CRUDS for public /channels/messages', () => {
    let createdId;
    return cloud.post(test.api)
    .then(r => createdId = r.body.ts)
    .then(r => cloud.get(`${test.api}/${createdId}`))
    .then(r => cloud.update(`${test.api}/${createdId}`, {text: 'this is an updated message test'}))
    .then(r => cloud.get(test.api))
    .then(r => cloud.remove(`${test.api}/${createdId}`));
  });
  it('should support CRUDS for private /channels/messages', () => {
    let createdId;
    return cloud.withOptions({qs: {group: true}}).post(test.api)
    .then(r => createdId = r.body.ts)
    .then(r => cloud.withOptions({qs: {group: true}}).get(`${test.api}/${createdId}`))
    .then(r => cloud.withOptions({qs: {group: true}}).update(`${test.api}/${createdId}`, {text: 'this is an updated message test'}))
    .then(r => cloud.withOptions({qs: {group: true}}).get(test.api))
    .then(r => cloud.withOptions({qs: {group: true}}).remove(`${test.api}/${createdId}`));
  });




});

// total endppints = 43

// CHANNELS
//done/    GET all = /channels
//done/    POST new = /channels
//done/    GET one  = /channels
//done/    PATCH actions = /channels/{id}/actions
//done/    GET history = //channels/{id}/history


// MESSAGES
//done/        create - POST   /channels/{id}/messages
//done/        update - PATCH  /channels/{id}/messages (req ts)
//done/        delete - DELETE /channels/{id}/messages
//inprog/      invite user - POST /channels/{id}/user
// del this --- POST /me-message
