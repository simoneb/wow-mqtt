var exercise = require('workshopper-exercise')(),
    filecheck = require('workshopper-exercise/filecheck'),
    execute = require('workshopper-exercise/execute'),
    comparestdout = require('workshopper-exercise/comparestdout'),
    mosca = require('mosca'),
    chance = require('chance').Chance();


exercise = filecheck(exercise);

exercise = execute(exercise);

exercise = comparestdout(exercise);

function rndport() {
  return 1024 + Math.floor(Math.random() * 64511);
}

exercise.addSetup(function (mode, callback) {
  var submissionTopic = chance.word();
  var solutionTopic = chance.word();
  var message = chance.word();

  this.submissionPort = this.solutionPort = rndport();

  this.submissionArgs = ['mqtt://localhost:' + this.submissionPort, submissionTopic];
  this.solutionArgs = ['mqtt://localhost:' + this.solutionPort, solutionTopic];

  this.server = new mosca.Server({
    port: this.submissionPort
  });

  this.server.on('subscribed', (function (topic) {
    this.server.publish({ topic: topic, payload: message });
  }).bind(this));

  this.server.on('ready', callback);
});

exercise.addCleanup(function (mode, passed, callback) {
  if (!this.server)
    return process.nextTick(callback);

  this.server.close(callback);
});

module.exports = exercise;