var mqtt = require('mqtt');

var brokerUrl = process.argv[2];
var topic = process.argv[3];

mqtt.connect(brokerUrl)
    .subscribe(topic)
    .on('message', function (topic, message) {
      console.log(message.toString());
      this.end();
    });