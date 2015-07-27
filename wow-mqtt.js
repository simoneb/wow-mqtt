#!/usr/bin/env node

var workshopper = require('workshopper'),
    path = require('path');

workshopper({
  name: 'wow-mqtt',
  title: 'WOW-MQTT',
  subtitle: 'Learn how to use MQTT in Node.js',
  appDir: __dirname,
  exerciseDir: path.join(__dirname, 'exercises')
});