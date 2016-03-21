/**
 *
 */
const moment = require('moment');
const pad = require('../helpers/pad');

var Pomodoro = function() {
  this.timerFrom = '';
  this.timerTo = '';
}

Pomodoro.prototype.setTimer = (time, duration) => {
  this.timerFrom = moment.duration(0, 'seconds')
  this.timerTo = moment.duration(time, duration);
}

Pomodoro.prototype.getTimerTo = () => {
  return this.timerTo;
}

Pomodoro.prototype.totalSeconds = () => {
  return this.timerTo.asSeconds()+1
}

Pomodoro.prototype.getTime = (type) => {
  return pad(this[type].minutes(),0,2)+':'+pad(this[type].seconds(),0,2);
}

Pomodoro.prototype.tick = () => {
  this.timerFrom.add(1, 's')
}

module.exports = new Pomodoro();
