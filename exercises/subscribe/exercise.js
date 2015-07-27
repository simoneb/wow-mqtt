var exercise = require('workshopper-exercise')(),
    filecheck = require('workshopper-exercise/filecheck'),
    execute = require('workshopper-exercise/execute'),
    comparestdout = require('workshopper-exercise/comparestdout'),
    chance = require('chance').Chance(),
    util = require('../../util');

exercise = filecheck(exercise);
exercise = execute(exercise);
exercise = util.createServer(exercise);

exercise.addSetup(function (mode, callback) {
  var submissionTopic = chance.word(),
      solutionTopic = chance.word(),
      brokerUrl = ('mqtt://localhost:' + String(this.port)),
      message = chance.word();

  this.submissionArgs = [brokerUrl, submissionTopic];
  this.solutionArgs = [brokerUrl, solutionTopic];

  this.server.on('subscribed', function (topic) {
    this.publish({ topic: topic, payload: message });
  });

  callback();
});

exercise = util.checkClientsDisconnected(exercise, true);

exercise = comparestdout(exercise);

exercise = util.shutdownServer(exercise);

module.exports = exercise;