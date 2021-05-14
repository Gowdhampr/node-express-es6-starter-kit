require('babel-core/register');
require("regenerator-runtime/runtime");
const dotenv = require("dotenv");
dotenv.config();

const { PGUSER, PGHOST, PGPORT, PGDATABASE, PGPASSWORD } = process.env;

// DB connect Data
const dbConnectionData = {
    username: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,
    host: PGHOST,
    pgPort: PGPORT || 5432,
    dialect: "postgres",
};

module.exports = {
    // Pointing To Development DB
    development: dbConnectionData,

    // Pointing To Production DB
    production: dbConnectionData,
};
