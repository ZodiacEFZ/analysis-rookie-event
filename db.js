const jsonfile = require('jsonfile');
const config = require('./const');

module.exports = {
  "data": {
    "events": {},
    "stats": {},
    "teams": {}
  },
  "setup": function(cb) {
    jsonfile.readFile(config.db_path + "db.json", (err, obj) => {
      if (!err) {
        this.data = obj;
      }
      cb(null);
    });
  },
  "save": function(cb) {
    jsonfile.writeFile(config.db_path + "db.json", this.data, {spaces: 2}, (err) => {
      cb(err);
    });
  }
};
