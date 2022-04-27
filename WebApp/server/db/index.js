const pg = require('pg')


var types = pg.types;
types.setTypeParser(1114, function(stringValue) {
    return new Date(stringValue + "+0000");
});

const pool = new pg.Pool()

module.exports = {
    query: (text, params) => pool.query(text, params),
  }