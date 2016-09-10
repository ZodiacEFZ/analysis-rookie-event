const debug = require('debug')('analyze:event-stat');
const config = require('../const');

let tba = require('../tba');

module.exports = (event, year) => {
  year = year || config.data_year;
  return {
    name: "Getting Event Teams of " + event.event_code + " in " + year,
    run: (cb) => {
      tba.getTeamsAtEvent(event.event_code, year, (err, teams) => {
        cb(err, {teams, event});
      });
    }
  };
};
