var exercise = require('workshopper-exercise')(),
    filecheck = require('workshopper-exercise/filecheck'),
    execute = require('workshopper-exercise/execute'),
    comparestdout = require('workshopper-exercise/comparestdout'),
    mosca = require('mosca'),
    chance = require('chance').Chance();


exercise = filecheck(exercise);
exercise = execute(exercise);

function rndport() {
  return 1024 + Math.floor(Math.random() * 64511);
}

exercise.addSetup(function (mode, callback) {
  var submissionTopic = chance.word(),
      solutionTopic = chance.word(),
      message = chance.word();

  this.clientCount = 0;
  this.submissionPort = this.solutionPort = rndport();

  var brokerUrl = ('mqtt://localhost:' + String(this.submissionPort));

  this.submissionArgs = [brokerUrl, submissionTopic];
  this.solutionArgs = [brokerUrl, solutionTopic];

  this.server = new mosca.Server({ port: this.submissionPort })
      .on('clientConnected', (function () {
        this.clientCount++;
      }).bind(this))
      .on('clientDisconnected', (function () {
        this.clientCount--;
      }).bind(this))
      .on('subscribed', function (topic, client) {
        this.publish({ topic: topic, payload: message });
      })
      .on('ready', callback);
});

exercise.addProcessor(function (mode, callback) {
  setTimeout(query.bind(this), 500);

  setImmediate(function () {
    callback(null, true)
  });
});

exercise = comparestdout(exercise);

function query() {
  if (this.clientCount > 0) {
    this.emit('fail', 'Client did not disconnect from broker');
    process.exit(1);
  }
}

exercise.addCleanup(function (mode, passed, callback) {
  if (!this.server)
    return setImmediate(callback);

  this.server.close(callback);
});

module.exports = exercise;