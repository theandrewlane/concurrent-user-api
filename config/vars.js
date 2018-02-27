module.exports = {
    env: process.env.NODE_ENV || 'dev',
    port: process.env.PORT || 3000,
    mongo: process.env.MONGO_URI || 'mongodb://localhost:27017/node-starter'
};
