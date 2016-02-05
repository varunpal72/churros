'use strict';

const chakram = require('chakram');
const expect = chakram.expect;
const props = require('core/props');

const fail = (msg) => {
  throw new Error((msg || 'This should not have happened'));
};

const setupProps = () => {
  props({
    'real.key': 'real value',
    'myelement': {
      'my.config.key': 'my config value',
      'my.optional.key': 'my optional value'
    }
  });
};

describe('props', () => {
  it('should allow getting a property that exists', () => {
    setupProps();
    const value = props.get('real.key');
    expect(value).to.be.equal('real value');
  });

  it('should throw an error for a required property that does not exist', () => {
    setupProps();
    try {
      props.get('fake.key');
    } catch (e) {
      expect(e.message).to.contain('fake.key');
      return true;
    }
    fail();
  });

  it('should allow getting a property for an element that exists', () => {
    setupProps();
    const value = props.getForKey('myelement', 'my.config.key');
    expect(value).to.be.equal('my config value');
  });

  it('should throw an error for a required property that does not exist on an element that exists', () => {
    setupProps();
    try {
      props.getForKey('myelement', 'not.a.real.key');
    } catch (e) {
      expect(e.message).to.contain('myelement');
      return true;
    }
    fail();
  });

  it('should throw an error for a required property that does not exist on an element that does not exist', () => {
    setupProps();
    try {
      props.getForKey('fakeelementname', 'not.a.real.key.either');
    } catch (e) {
      expect(e.message).to.contain('fakeelementname');
      return true;
    }
    fail();
  });

  it('should allow getting an optional property for an element that exists', () => {
    setupProps();
    const value = props.getOptionalForKey('myelement', 'my.optional.key');
    expect(value).to.be.equal('my optional value');
  });

  it('should not throw an error for an optional property that does not exist for an element that exists', () => {
    setupProps();
    const value = props.getOptionalForKey('myelement', 'my.optional.key.that.really.does.not.exist');
    expect(value).to.be.null;
  });

  it('should support getting all properties for an element', () => {
    setupProps();
    const values = props.all('myelement');
    expect(values).to.not.be.empty;
  });

  it('should throw an error when getting all properties for a non-existing element', () => {
    setupProps();
    try {
      props.all('fakeelement');
    } catch (e) {
      expect(e.message).to.contain('fakeelement');
      return true;
    }
    fail();
  });

  it('should support setting new properties', () => {
    setupProps();
    props.set('new.key', 'new value');
    const value = props.get('new.key');
    expect(value).to.be.equal('new value');
  });

  it('should support setting new properties for an element that exists', () => {
    setupProps();
    props.setForKey('myelement', 'brand.new.key', 'brand new value');
    const value = props.getForKey('myelement', 'brand.new.key');
    expect(value).to.be.equal('brand new value');
  });

  it('should support setting new properties for an element that does not exist', () => {
    setupProps();
    props.setForKey('newelement', 'brand.new.key', 'brand new value');
    const value = props.getForKey('newelement', 'brand.new.key');
    expect(value).to.be.equal('brand new value');
  });
});
