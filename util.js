var mosca = require('mosca'),
    through2 = require('through2');

module.exports = {
  shutdownServer: shutdownServer,
  checkClientsDisconnected: checkClientsDisconnected,
  createServer: createServer,
  overrideStdout: overrideStdout
};

function shutdownServer(exercise) {
  return exercise.addCleanup(function (mode, passed, callback) {
    if (!this.server)
      return setImmediate(callback);

    this.server.close(callback);
  });
}

function checkClientsDisconnected(exercise) {
  return exercise.addProcessor(function (mode, callback) {
    if (exercise.stdoutOverridden) {
      setTimeout(checkClientDisconnected.bind(this, function () {
      }), 500);
      setImmediate(function () {
        callback(null, true);
      });
    } else {
      setTimeout(checkClientDisconnected.bind(this, callback), 500);
    }
  });

  function checkClientDisconnected(callback) {
    if (this.clientCount > 0) {
      this.emit('fail', 'client did not disconnect from broker');
      process.exit(1);
    }
    callback(null, true);
  }
}

function rndport() {
  return 1024 + Math.floor(Math.random() * 64511);
}

function createServer(exercise) {
  exercise.clientCount = 0;
  var port = exercise.port = rndport();

  return exercise.addSetup(function (mode, callback) {
    exercise.server = new mosca.Server({ port: port })
        .on('clientConnected', function () {
          exercise.clientCount++;
        })
        .on('clientDisconnected', function () {
          exercise.clientCount--;
        })
        .on('ready', callback);
  });

}

function overrideStdout(exercise) {
  exercise.stdoutOverridden = true;

  exercise.getStdout = function (type, child) {
    if (type === 'submission') child.stdout.pipe(process.stdout);

    return through2();
  };

  return exercise;
}