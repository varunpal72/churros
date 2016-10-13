'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const genEmail = require('core/tools').randomEmail;
const genName = require('core/tools').random;
const contact = require('./assets/contacts');

const genList = () => JSON.stringify({ Name: genName() });
const genContact = () => JSON.stringify(Object.assign({}, contact, { Email: genEmail() }));

const payload = genList();

suite.forElement('marketing', 'lists', { payload: payload }, (test) => {
	test.should.supportPagination();

	/*
	 * Everything below here is broken
	 * "message":"Could not serialize the following field(s):  - Did you pass an array when it should be an object?"}
	 */
	test.should.supportCruds();

	it('should allow CRUDS for /lists/:id/contacts', () => {
	    let listId;
	    let contactId;
	    return cloud.post(test.api, genList())
	      .then(r => { listId = r.body.ID })
	      .then(r => cloud.post(`${test.api}/${listId}/contacts/`, genContact()))
	      .then(r => { contactId = r.body.ID })
	      .then(r => cloud.get(`${test.api}/${listId}/contacts/${contactId}`))
	      .then(r => cloud.patch(`${test.api}/${listId}/contacts/${contactId}`, genContact()))
	      .then(r => cloud.delete(`${test.api}/${listId}/contacts/${contactId}`))
	      .then(r => cloud.delete(`${test.api}/${listId}`));
	});
});
