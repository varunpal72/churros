'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const schema = require('./assets/task.schema.json');
const tasksSchema = require('./assets/tasks.schema.json');

suite.forElement('marketing', 'files', (test) => {
  it('should allow creating a file for an uploaded file, and should get the created file', () => {
    let fileId;
    let path = __dirname + '/assets/brady.jpg';
    let updatePath = __dirname + '/assets/brady_updated.jpg';

    return cloud.postFile(test.api, path)
      .then(r => fileId = r.body.result[0].id)
      .then(r => cloud.get(`${test.api}`))
      .then(r => cloud.patchFile(`${test.api}/${fileId}`, updatePath))
      .then(r => cloud.get(`${test.api}/${fileId}`));
  });

  //it('should allow creating a task to process text fields in an uploaded file, and should get the created task',
  //        () => {
  //  let taskId = "-1";
  //  let path = __dirname + '/assets/brady.jpg';

  //  return cloud.postFile(test.api + '/textfields', path)
  //    .then(r => taskId = r.body["@id"])
  //    .then(r => cloud.get(test.api + '/' + taskId, (r) => expect(r).to.have.schemaAnd200(schema)));
  //});

  //test.withValidation(tasksSchema).should.return200OnGet();
  //test.withApi(`${test.api}/finished`).withValidation(tasksSchema).should.return200OnGet();
});
