const async = require('async');
const config = require('./const');
const debug = require('debug')('analyze:queue');

module.exports = () => {
  return async.queue((task, callback) => {
   debug(task.name + "...");
   task.run((err, result) => {
    debug("Complete " + task.name);
    callback(err, result);
   });
 }, config.max_concurrent);
};
