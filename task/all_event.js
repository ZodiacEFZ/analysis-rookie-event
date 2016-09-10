const debug = require('debug')('analyze:all-event');
const config = require('../const');

let tba = require('../tba');

module.exports = {
  name: "Getting all Events",
  run: (cb) => {
    tba.getListOfEvents(config.analyze_year, (err, events) => {
      cb(err, events);
    });
  }
};
