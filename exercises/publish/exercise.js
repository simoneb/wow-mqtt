var exercise = require('workshopper-exercise')(),
    filecheck = require('workshopper-exercise/filecheck'),
    execute = require('workshopper-exercise/execute'),
    comparestdout = require('workshopper-exercise/comparestdout'),
    chance = require('chance').Chance(),
    util = require('../../util');

exercise = filecheck(exercise);
exercise = execute(exercise);
exercise = util.overrideStdout(exercise);
exercise = util.createServer(exercise);

exercise.addSetup(function (mode, callback) {
  var submissionTopic = chance.word(),
      solutionTopic = chance.word(),
      brokerUrl = ('mqtt://localhost:' + String(this.port));

  this.submissionArgs = [brokerUrl, submissionTopic];
  this.solutionArgs = [brokerUrl, solutionTopic];

  this.server.on('published', (function (packet) {
    switch (packet.topic) {
      case submissionTopic:
        this.submissionStdout.write(packet.payload + '\n');
        this.submissionStdout.end();
        break;
      case solutionTopic:
        this.solutionStdout.write(packet.payload + '\n');
        this.solutionStdout.end();
        break;
    }
  }).bind(this));

  callback();
});

exercise = util.checkClientsDisconnected(exercise);

exercise = comparestdout(exercise);

exercise = util.shutdownServer(exercise);

module.exports = exercise;