const debug = require('debug')('analyze:main');
const async = require('async');
const csv = require('csv');
const _ = require('lodash');
const moment = require('moment-timezone');

const config = require('./const');
const db = require('./db');

let tba = require('./tba');

async.series([
  function(callback) {
    debug("Setting up cache...");
    db.setup(callback);
  },
  function(callback) {
    let q = require('./queue')();

    q.drain = function() {
      callback(null, null);
    };

    q.push(require('./task/all_event'), (err, events) => {
      if (err) throw err;
      debug("Processing Events...");
      let __events_stat = _.chain(events)
        .filter(event => event.event_type === 0)
        .filter(event => event.official)
        .map((event) => {
          db.data.events[event.event_code] = event;
          return (event.event_code in db.data.stats) ? null : require('./task/event_stat')(event);
        })
        .filter(_.isObject)
        .value();
      let __events_team = _.chain(events)
        .filter(event => event.event_type === 0)
        .filter(event => event.official)
        .map((event) => {
          db.data.events[event.event_code] = event;
          return (event.event_code in db.data.teams) ? null : require('./task/event_team')(event);
        })
        .filter(_.isObject)
        .value();
      let __events_team_previous = _.chain(events)
        .filter(event => event.event_type === 0)
        .filter(event => event.official)
        .map((event) => {
          db.data.events[event.event_code] = event;
          return (event.event_code in db.data.teams) ? null : require('./task/event_team')(event, config.data_year - 1);
        })
        .filter(_.isObject)
        .value();
      q.push(__events_stat, (err, {stat, event}) => {
        if (!err) {
          db.data.stats[event.event_code] = stat;
        }
      });
      q.push(__events_team, (err, {teams, event}) => {
        if (!err) {
          db.data.teams[event.event_code] = teams;
        }
      });
      q.push(__events_team_previous, (err, {teams, event}) => {
        if (!err) {
          db.data["2015"].teams[event.event_code] = teams;
        }
      });
    });
  },
  function(callback) {
    debug("Saving cache...");
    db.save(callback);
  },
  function(callback) {
    debug("Saving as CSV...");
    let data = _.chain(db.data.events)
      .map(event => {
        let stat = db.data.stats[event.event_code];
        let teams = db.data.teams[event.event_code];
        let teams_previous = db.data["2015"].teams[event.event_code];
        if (!stat) {
          return [
            event.name,
            event.start_date,
            event.end_date,
            event.timezone,
            "UTC" + moment(event.start_date).tz(event.timezone).format("Z"),
            event.location,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            "https://www.thebluealliance.com/event/" + config.analyze_year + event.event_code
          ];
        }
        stat = stat.year_specific;

        return [
          event.name,
          event.start_date,
          event.end_date,
          event.timezone,
          "UTC" + moment(event.start_date).tz(event.timezone).format("Z"),
          event.location,
          stat.qual.high_score[0],
          stat.qual.average_score,
          stat.qual.average_win_score,
          stat.playoff.high_score[0],
          stat.playoff.average_score,
          stat.playoff.average_win_score,
          _.countBy(teams_previous, 'country_name')["China"] || 0,
          _.countBy(teams, 'country_name')["China"] || 0,
          _.countBy(teams_previous, 'rookie_year')[config.analyze_year - 1] || 0,
          _.countBy(teams, 'rookie_year')[config.analyze_year - 1] || 0,
          "https://www.thebluealliance.com/event/" + config.data_year + event.event_code
        ];
      })
      .filter(_.isArray)
      .value();
    require('./task/export')(data).run(callback);
  }
],
function(err, results) {
  if (err) throw err;
});
