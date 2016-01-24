"use strict";

const cluster = require('cluster')
  , os = require('os')
  , _  = require('lodash')
  , config  = require('./config.js')[process.env['F1QuickPick_ENV']] || require('./config.js')['development']
  , server = require('./server.js');

let startServer = function() {
  server.startServer(config);
};

let startMultiCore = function() {

  let onExit = function(worker) {
    console.log('worker ' + worker.process.pid + ' died');
  };

  let forkWorkers = function(numCPUs){
    for (var i = 0; i < numCPUs; i++) {
      let w = cluster.fork({processIdentity: i });

      console.log('Starting:', 'processIdentity: ' + i +
        ' workerId:' + w.workerId +
        ' processId:' + w.process.pid)
    }

    cluster.on('exit', onExit);
  };

  if (cluster.isMaster) {
    forkWorkers(os.cpus().length)
  } else {
    startServer();
  }
};

console.log('Starting: ', process.env['FRT_ENV'] || 'development');
if(config.singleCore || _.isUndefined(config.singleCore) || _.isNull(config.singleCore)) {
  process.env['processIdentity'] = 'single core';
  startServer();
}else {
  startMultiCore();
}
