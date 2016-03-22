#!/usr/bin/env node
'use strict';

const path = require('path');
const notifier = require('node-notifier');
const progress = require('progress');
const colors = require('colors');
const program = require('commander');
const pomodoro = require('./models/pomodoro');

program
  .version('0.0.3')
  .usage('Pomodoro cli - a simple pomodoro for terminal')
  .option('-s, --shortbreak', 'Add short break timer')
  .option('-l, --longbreak', 'Add long break timer')
  .option('-t, --timer <time>', 'Add specific time in minutes', parseInt)
  .option('-a, --add-task <task>', 'Add a new task', 'task')
  .parse(process.argv);

const init = () => {
  let pomodoroConfig = {};

  pomodoroConfig = getTimeToPomodoro();

  pomodoro.setTimer(pomodoroConfig.time, 'minutes');
  pomodoro.setMessage(pomodoroConfig.message);

  var bar = new progress(':timerFrom [:bar] :timerTo'.red, {
    complete: '=',
    incomplete: ' ',
    width: 50,
    total: pomodoro.totalSeconds(),
    timerTo: pomodoro.getTime('timerTo'),
    timerFrom: pomodoro.getTime('timerFrom')
  });

  setInterval(() => {
    tick(bar);
  },1000);
};

const getTimeToPomodoro = () => {
  let pomodoroConfig = {};

  if(program.shortbreak) {
    pomodoroConfig.time = 5;
    pomodoroConfig.message = 'Let\'s get back to work!';
  } else if(program.longbreak) {
    pomodoroConfig.time = 10;
    pomodoroConfig.message = 'Let\'s get back to work! What you\'ve been doing?';
  } else if(program.timer) {
    pomodoroConfig.time = program.timer;
    pomodoroConfig.message = 'Time\'s up! What you\'re gonna do next?';
  } else {
    pomodoroConfig.time = 25;
    pomodoroConfig.message = 'Go ahead, take a break, you earned it!'
  }

  return pomodoroConfig;
}
const tick = (bar) => {
  bar.tick(1, {
    timerFrom: pomodoro.getTime('timerFrom'),
    timerTo: pomodoro.getTime('timerTo')
  });

  if( bar.completed ) {
    notifier.notify({
      title: 'Pomodoro Cli',
      message: pomodoro.getMessage(),
      icon: path.join(__dirname, 'images/pomodoro.png'),
      sound: 'true',
    });

    process.exit(0);
  }

  pomodoro.tick();
};

init();
