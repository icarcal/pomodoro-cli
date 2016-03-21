#!/usr/bin/env node
'use strict';

const path = require('path');
const notifier = require('node-notifier');
const progress = require('node-progress-bars');
const program = require('commander');
const pomodoro = require('./models/pomodoro');

program
  .version('0.0.2')
  .usage('TESTE')
  .option('-s, --shortbreak', 'Add short break timer')
  .option('-l, --longbreak', 'Add long break timer')
  .option('-t, --timer <time>', 'Add specific time in minutes', parseInt)
  .option('-a, --add-task <task>', 'Add a new task', 'task')
  .parse(process.argv);

const init = () => {
  var time = 0;

  if(program.shortbreak) {
    time = 5;
  } else if(program.longbreak) {
    time = 10;
  } else if(program.timer) {
    time = program.timer;
  } else {
    time = 25;
  }

  pomodoro.setTimer(time, 'minutes');

  var bar = new progress({
    schema: ':timerFrom.red [:bar].red :timerTo.red',
    filled: '=',
    blank: ' ',
    width: 20,
    total: pomodoro.totalSeconds(),
    timerTo: pomodoro.getTime('timerTo'),
    timerFrom: pomodoro.getTime('timerFrom')
  });

  setInterval(() => {
    tick(bar);
  },1000);
};

const tick = (bar) => {
  bar.tick(1, {
    timerFrom: pomodoro.getTime('timerFrom'),
    timerTo: pomodoro.getTime('timerTo')
  });

  if( bar.completed ) {
    notifier.notify({
      title: 'Pomodoro Cli',
      message: 'Go ahead, take a break, you deserve it!',
      icon: path.join(__dirname, 'images/pomodoro.png'),
      sound: 'true',
    });

    process.exit(0);
  }

  pomodoro.tick();
};

init();
