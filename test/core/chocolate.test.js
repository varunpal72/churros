const chocolate = require('core/chocolate');
const chai = require('chai');
const expect = chai.expect;

describe('chocolate', () => {
  it('should generate a random string', () => {
    const random = chocolate.random();
    expect(random).to.be.a('string');
  });
});
