/**
 *
 */
const moment = require('moment');
const pad = require('../helpers/pad');

var Pomodoro = function() {
  this.type = ''
  this.timerFrom = '';
  this.timerTo = '';
  this.message = '';
}

Pomodoro.prototype.setConfig = function (type, timer, playSound) {
  const pomodoroConfig = {
    shortbreak : { time: 5, message: 'Let\'s get back to work!' },
    longbreak : { time: 10, message: 'Let\'s get back to work! What you\'ve been doing?' },
    timer : { time: timer, message: 'Time\'s up! What you\'re gonna do next?' },
    default : { time: 25, message: 'Go ahead, take a break, you earned it!' },
  };

  const config = pomodoroConfig[type];

  this.type = type;
  this.message = config.message;
  this.setTimer(config.time, 'minutes');
  this.playSound = playSound;
}

Pomodoro.prototype.setTimer = (time, duration) => {
  this.timerFrom = moment.duration(0, 'seconds')
  this.timerTo = moment.duration(time, duration);
}

Pomodoro.prototype.setMessage = message => this.message = message;

Pomodoro.prototype.getTimerTo = () => this.timerTo;

Pomodoro.prototype.getMessage = () => this.message;

Pomodoro.prototype.getTime = type => {
  const minutes = pad(this[type].minutes(), 0, 2);
  const seconds = pad(this[type].seconds(), 0, 2);

  return `${minutes}:${seconds}`;
};

Pomodoro.prototype.totalSeconds = () => this.timerTo.asSeconds()+1;

Pomodoro.prototype.tick = () => this.timerFrom.add(1, 's');

module.exports = new Pomodoro();
