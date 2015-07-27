var mqtt = require('mqtt');

var brokerUrl = process.argv[2];
var topic = process.argv[3];

var client = mqtt.connect(brokerUrl)
    .publish(topic, 'hello world')
    .end();