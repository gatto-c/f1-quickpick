module.exports = {
  getConfig: function() {
    return require('./config.js')[process.env['F1QUICKPICK_ENV']] || require('./config.js')['development']
  },

  production: {
    port: 80,
    mongoUri: "mongodb://localhost:27017/Pick6",
    jwtSecret: "0817d447f",
    jwtExpiryDays: 1,
    jwtExpiryMinutes: 30,
    ergastAPIAddress: "http://ergast.com/api/f1/"
  },

  development: {
    port: 8080,
    mongoUri: "mongodb://localhost:27017/Pick6",
    jwtSecret: "tr56980gte",
    jwtExpiryDays: 1,
    jwtExpiryMinutes: 30,
    ergastAPIAddress: "http://ergast.com/api/f1/"
  }
};
