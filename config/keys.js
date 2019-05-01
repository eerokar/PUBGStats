module.exports = {
    MongoURI: `mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/jellyDB`,
    MongoURILocal:'mongodb://localhost/PUBGStatsService'
};