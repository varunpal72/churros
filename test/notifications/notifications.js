'use strict';

const chakram = require('chakram');
const expect = chakram.expect;
const churrosUtil = require('../../core/src/util/churros-util');
const api = require('../../core/src/util/api');

const schema = require('./assets/notification.schema.json');

const notifyGen = (opts) => new Object({
  severity: (opts.severity || 'low'),
  topic: (opts.topic || 'churros-topic'),
  message: (opts.message || 'this is a test message'),
  from: (opts.from || 'churros')
});

describe('notification APIs', () => {
  const url = '/notifications';

  it('should allow creating, retrieving and deleting a notification', () => {
    const n = notifyGen({});
    return api.crd(url, n, schema);
  });

  it('should return one notification when searching for this topic', () => {
    const n = notifyGen({
      topic: 'churros-topic-' + churrosUtil.random()
    });

    return chakram.post(url, n)
      .then((r) => {
        expect(r).to.have.status(200);
        expect(r).to.have.schema(schema);

        return chakram.get(url + '?topics[]=' + n.topic);
      })
      .then((r) => {
        expect(r).to.have.status(200);
        expect(r.body).to.not.be.empty;
        expect(r.body.length).to.equal(1);

        return chakram.delete(url + '/' + r.body[0].id);
      })
      .then((r) => {
        expect(r).to.have.status(200);
      });
  });

  it('should allow acknowledging a notification', () => {
    const n = notifyGen({});

    return chakram.post(url, n)
      .then((r) => {
        expect(r).to.have.status(200);
        expect(r).to.have.schema(schema);
        expect(r.body.acknowledged).to.equal(false);

        return chakram.put(url + '/' + r.body.id + '/acknowledge');
      })
      .then((r) => {
        expect(r).to.have.status(200);
        expect(r.body).to.not.be.empty;
        expect(r.body.acknowledged).to.equal(true);

        return chakram.delete(url + '/' + r.body.id);
      })
      .then((r) => {
        expect(r).to.have.status(200);
      });
  });

  it('should return an empty array if no notifications are found with the given topic', () => {
    return chakram.get(url + '?topics[]=fake-topic-name')
      .then((r) => {
        expect(r).to.have.status(200);
        expect(r.body).to.be.empty;
      });
  });

  it('should throw a 400 if missing search query', () => {
    return chakram.get(url)
      .then((r) => {
        expect(r).to.have.status(400);
      });
  });

  it('should throw a 404 if the notification does not exist', () => {
    return chakram.get(url + '/' + -1)
      .then((r) => {
        expect(r).to.have.status(404);
      });
  });

  it('should throw a 400 if notification JSON is null', () => {
    return chakram.post(url, null)
      .then((r) => {
        expect(r).to.have.status(400);
      });
  });

  it('should throw a 400 if missing fields when creating a notification', () => {
    const n = notifyGen({});
    n.topic = null;

    return chakram.post(url, n)
      .then((r) => {
        expect(r).to.have.status(400);
      });
  });
});
