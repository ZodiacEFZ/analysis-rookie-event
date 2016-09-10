const fs = require('fs');
const debug = require('debug')('analyze:event-export');
const config = require('../const');
const csv = require('csv');

module.exports = (data) => {
  return {
    name: "Exporting",
    run: (cb) => {
      csv.stringify(data, function(err, data){
        if (err) cb(err, null);
        fs.writeFile(config.db_path + "data.csv", data, (err) => {
          if (err) cb(err, null);
          cb(null, null);
        });
      });
    }
  };
};
