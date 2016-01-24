var winston = require('winston');

var winstonLevels = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 4
  },
  colors: {
    debug: 'blue',
    info: 'green',
    warn: 'yellow',
    error: 'red'
  }
};

var logger = new (winston.Logger)({
  level: 'error',
  levels: winstonLevels.levels,
  transports: [
    new (winston.transports.Console)({
      level: 'error',
      levels: winstonLevels.levels,
      colorize: true
    })
    //, new (winston.transports.File)({ filename: 'somefile.log' })
  ]
});

winston.addColors( winstonLevels.colors );
//winston.addColors = winston.config.addColors;


module.exports = logger;

