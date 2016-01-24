module.exports = {
  production: {
    port: 80,
    mongoUri: "mongodb://localhost:27017/Pick6",
    jwtSecret: "0817d447f"
  },

  development: {
    port: 8080,
    mongoUri: "mongodb://localhost:27017/Pick6",
    jwtSecret: "tr56980gte"
  }
};
