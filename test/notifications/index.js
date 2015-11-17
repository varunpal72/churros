var chakram = require('chakram'),
  expect = chakram.expect;

// load the JSON schemas to validate against
var notificationSchema = require('./notification.schema.json');
var subscriptionSchema = require('./subscription.schema.json');

describe('notifications and subscriptions APIs', function () {
  var url = '/notifications';

  it('should allow creating, retrieving and deleting a notification', function () {
    var notification = {
      severity: 'low',
      topic: 'churros-topic',
      message: 'this is a test message',
      from: 'churros'
    };

    return chakram.post(url, notification)
      .then(function (response) {
        expect(response).to.have.status(200);
        expect(response).to.have.schema(notificationSchema);

        var id = response.body.id;
        return chakram.get(url + '/' + id);
      })
      .then(function (response) {
        expect(response).to.have.status(200);
        expect(response).to.have.schema(notificationSchema);
        expect(response.body.severity).to.equal(notification.severity);
        expect(response.body.topic).to.equal(notification.topic);
        expect(response.body.message).to.equal(notification.message);

        var id = response.body.id;
        return chakram.delete(url + '/' + id)
      })
      .then(function (response) {
        expect(response).to.have.status(200);
      });
  });

  it('should return one notification when searching for this topic', function () {
    var randomTopic = 'churros-topic-' + Math.random().toString(36).substring(7);
    var randomNotification = {
      message: "this is a test message",
      from: "churros",
      severity: "low",
      topic: randomTopic
    };
    return chakram.post(url, randomNotification)
      .then(function (response) {
        expect(response).to.have.status(200);
        expect(response).to.have.schema(notificationSchema);
        return chakram.get(url + '?topics[]=' + randomTopic);
      })
      .then(function (response) {
        expect(response).to.have.status(200);
        expect(response.body).to.not.be.empty;
        expect(response.body.length).to.equal(1);

        var id = response.body[0].id;
        return chakram.delete(url + '/' + id)
      })
      .then(function (response) {
        expect(response).to.have.status(200);
      });
  });

  it('should allow acknowledging a notification', function () {
    var notification = {
      severity: 'low',
      topic: 'churros-topic',
      message: 'this is a test message',
      from: 'churros'
    };

    return chakram.post(url, notification)
      .then(function (response) {
        expect(response).to.have.status(200);
        expect(response).to.have.schema(notificationSchema);
        expect(response.body.acknowledged).to.equal(false);

        var id = response.body.id;
        return chakram.put(url + '/' + id + '/acknowledge');
      })
      .then(function (response) {
        expect(response).to.have.status(200);
        expect(response.body).to.not.be.empty;
        expect(response.body.acknowledged).to.equal(true);

        var id = response.body.id;
        return chakram.delete(url + '/' + id)
      })
      .then(function (response) {
        expect(response).to.have.status(200);
      });
  });

  it('should return an empty array if no notifications are found with the given topic', function () {
    return chakram.get(url + '?topics[]=fake-topic-name')
      .then(function (response) {
        expect(response).to.have.status(200);
        expect(response.body).to.be.empty;
      });
  });

  it('should throw a 400 if missing search query', function () {
    return chakram.get(url).then(function (response) {
      expect(response).to.have.status(400);
    });
  });

  it('should throw a 404 if the notification does not exist', function () {
    return chakram.get(url + '/' + -1).then(function (response) {
      expect(response).to.have.status(404);
    });
  });

  it('should throw a 400 if notification JSON is null', function () {
    return chakram.post(url, null)
      .then(function (response) {
        expect(response).to.have.status(400);
      });
  });

  it('should throw a 400 if missing fields when creating a notification', function () {
    var badNotification = {
      topic: null,
      message: 'this is a test message',
      severity: 'low'
    };
    return chakram.post(url, badNotification)
      .then(function (response) {
        expect(response).to.have.status(400);
      });
  });

  it('should allow creating, retrieving and deleting a subscription', function () {
    var subscription = {
      channel: 'webhook',
      topics: ['churros-topic'],
      config: {
        url: 'http://fake.churros.url.com'
      }
    };
    var subscriptionUrl = url + '/subscriptions';

    return chakram.post(subscriptionUrl, subscription)
      .then(function (response) {
        expect(response).to.have.status(200);
        expect(response).to.have.schema(subscriptionSchema);

        var id = response.body.id;
        return chakram.get(subscriptionUrl + '/' + id);
      })
      .then(function (response) {
        expect(response).to.have.status(200);
        expect(response).to.have.schema(subscriptionSchema);
        expect(response.body.topic).to.equal(subscription.topic);
        expect(response.body.channel).to.equal(subscription.channel);

        var id = response.body.id;
        return chakram.delete(subscriptionUrl + '/' + id)
      })
      .then(function (response) {
        expect(response).to.have.status(200);
      });
  });

  it('should throw a 400 if an email subscription is missing an email address', function () {
    var subscriptionUrl = url + '/subscriptions';
    var badSubscription = {
      channel: 'email',
      topics: ['churros-topic']
    };
    return chakram.post(subscriptionUrl, badSubscription)
      .then(function (response) {
        expect(response).to.have.status(400);
      });
  });

  it('should throw a 404 if the subscription ID does not exist', function () {
    var subscriptionUrl = url + '/subscriptions';
    return chakram.get(subscriptionUrl + '/' + -1).then(function (response) {
      expect(response).to.have.status(404);
    });
  });
});
