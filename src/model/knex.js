const {PGHOST, PGPORT, PGDATABASE, PGUSER} = process.env;
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: PGHOST,
        user: PGUSER,
        database: PGDATABASE,
        port: PGPORT,
    }
});

module.exports = knex;
