const chakram = require('chakram');
const expect = chakram.expect;

this.id = function () {
  const url = '/instances';
  return chakram.get(url)
    .then((r) => {
      console.log('Found an element instance with ID: ' + r.body[0].id);
      expect(r).to.have.status(200);
      return r.body[0].id;
    });
}

this.delete = function (id) {
  const url = '/instances/' + id;
  return chakram.delete(url)
    .then((r) => {
      console.log('Deleted element instance with ID: ' + id);
      expect(r).to.have.status(200);
      return r.body;
    })
}
