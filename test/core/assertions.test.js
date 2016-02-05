require('core/assertions');
const expect = require('chakram').expect;

const genResponse = () => new Object({
  response: {
    statusCode: 200,
    body: { id: 123 }
  }
});

const genSchema = () => new Object({
  type: 'object',
  properties: { id: { type: "number" } },
  required: ['id']
});

describe('custom assertions', () => {
  it('should support custom schemaAnd200 assertion', () => {
    expect(genResponse()).to.have.schemaAnd200(genSchema());
  });

  it('should support custom statusCode assertion', () => {
    expect(genResponse()).to.have.statusCode(200);
  });

  it('custom statusCode should handle bad inputs gracefully', () => {
    try {
      expect({ error: 'ERRCONNREFUSED' }).to.have.statusCode(200);
    } catch (e) {
      return true;
    }
    throw 'Fail';
  });

  it('custom statusCode should handle null input gracefully', () => {
    try {
      expect(null).to.have.statusCode(200);
    } catch (e) {
      return true;
    }
    throw 'Fail';
  });

  it('custom schemaAnd200 should handle bad inputs gracefully', () => {
    try {
      expect({ error: 'ERRCONNREFUSED' }).to.have.schemaAnd200({});
    } catch (e) {
      return true;
    }
    throw 'Fail';
  });

  it('custom schemaAnd200 should handle null input gracefully', () => {
    try {
      expect(null).to.have.schemaAnd200({});
    } catch (e) {
      return true;
    }
    throw 'Fail';
  });
});
