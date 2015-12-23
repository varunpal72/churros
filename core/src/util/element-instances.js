const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;

this.all = function () {
  const url = '/instances';
  return chakram.get(url)
    .then((r) => {
      console.log(util.format('Found %s element instances', r.body.size));
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
