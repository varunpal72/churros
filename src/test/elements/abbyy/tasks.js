'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const schema = require('./assets/task.schema.json');
const tasksSchema = require('./assets/tasks.schema.json');

suite.forElement('ocr', 'tasks', (test) => {
  it('should allow creating a task for an uploaded a file, get the created task and delete task', () => {
    let taskId = "-1";
    let path = __dirname + '/assets/brady.jpg';

    return cloud.postFile(test.api, path)
      .then(r => taskId = r.body["@id"])
      .then(r => cloud.get(test.api + '/' + taskId, (r) => expect(r).to.have.schemaAnd200(schema)))
      .then(r => cloud.delete(test.api + '/' + taskId, (r) => expect(r).to.have.schemaAnd200(schema)));
  });

  it('should allow creating a task to process text fields in an uploaded file, and should get the created task',
    () => {
      let taskId = "-1";
      let path = __dirname + '/assets/brady.jpg';

      return cloud.postFile(test.api + '/textfields', path)
        .then(r => taskId = r.body["@id"])
        .then(r => cloud.get(test.api + '/' + taskId, (r) => expect(r).to.have.schemaAnd200(schema)));
    });

  test.withValidation(tasksSchema).should.return200OnGet();
  test.withApi(`${test.api}/finished`).withValidation(tasksSchema).should.return200OnGet();
});
