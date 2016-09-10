const debug = require('debug')('analyze:event-stat');
const config = require('../const');

let tba = require('../tba');

module.exports = (event) => {
  return {
    name: "Getting Event Stats of " + event.event_code,
    run: (cb) => {
      tba.getStatsAtEvent(event.event_code, config.data_year, (err, stat) => {
        cb(err, {stat, event});
      });
    }
  };
};
