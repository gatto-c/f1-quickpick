var kafka = require('kafka-node');
var consumer = require('./consumer');

module.exports.submitMessage = function*(message, next){
  var Producer = kafka.Producer,
    KeyedMessage = kafka.KeyedMessage,
    client = new kafka.Client(),
    producer = new Producer(client),
    km = new KeyedMessage('key', 'message'),
    payloads = [
      { topic: 'test', messages: message, partition: 0 }
    ];

  producer.on('ready', function () {
    producer.send(payloads, function (err, data) {
      console.log(data);
    });
  });

  producer.on('error', function(err){
    console.error(err);
    next(err);
  });

  next(null, 200);
};
