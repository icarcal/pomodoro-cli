/**
 *
 */
const moment = require('moment');
const pad = require('../helpers/pad');

var Pomodoro = function() {
  this.timerFrom = '';
  this.timerTo = '';
  this.message = '';
}

Pomodoro.prototype.setTimer = (time, duration) => {
  this.timerFrom = moment.duration(0, 'seconds')
  this.timerTo = moment.duration(time, duration);
}

Pomodoro.prototype.setMessage = message => this.message = message;

Pomodoro.prototype.getTimerTo = () => this.timerTo;

Pomodoro.prototype.getMessage = () => this.message;

Pomodoro.prototype.getTime = type => pad(this[type].minutes(),0,2)+':'+pad(this[type].seconds(),0,2);

Pomodoro.prototype.totalSeconds = () => this.timerTo.asSeconds()+1;

Pomodoro.prototype.tick = () => this.timerFrom.add(1, 's');


module.exports = new Pomodoro();
