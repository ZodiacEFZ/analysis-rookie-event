const debug = require('debug')('analyze:event-stat');
const config = require('../const');

let tba = require('../tba');

module.exports = (event) => {
  return {
    name: "Getting Event Teams of " + event.event_code,
    run: (cb) => {
      tba.getTeamsAtEvent(event.event_code, config.data_year, (err, teams) => {
        cb(err, {teams, event});
      });
    }
  };
};
