var mqtt    = require('mqtt');
var client  = mqtt.connect(process.argv[2] || 'mqtt://test.mosquitto.org');
var topic = process.argv[3] || 'some_topic';

client.on('connect', function () {
  client.subscribe(topic);
});

client.on('message', function (topic, message) {
  console.log(message.toString());
  client.end();
});