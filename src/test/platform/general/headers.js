'use strict';

const suite = require('core/suite');
const props = require('core/props');
const chakram = require('chakram');
const expect = chakram.expect;

suite.forPlatform('general', {}, (test) => {
  describe('endpoint calls', () => {
    it('should include x-frame-options header to a JSP endpoint', () =>
      chakram.get('/elements/jsp/login.jsp', { baseUrl: props.get('url') })
      .then(r => expect(r).to.have.header('x-frame-options')));

    it('should not include x-frame-options header to a non-JSP endpoint', () =>
      chakram.get('/elements/api-docs', { baseUrl: props.get('url') })
      .then(r => expect(r).to.not.have.header('x-frame-options')));
  });
});
