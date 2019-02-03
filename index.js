#!/usr/bin/env node
'use strict';

const path = require('path');
const notifier = require('node-notifier');
const progress = require('progress');
const colors = require('colors');
const program = require('commander');
const pomodoro = require('./models/pomodoro');
var player = require('play-sound')();

const APP = {
  getPomodoroType: ({ shortbreak, longbreak, timer }) => {
    let timerTypeKey = 'default';
    const types = [
      {shortbreak},
      {longbreak},
      {timer}
    ];

    types.filter((type) => {
      const key = Object.keys(type)[0];

      if (type[key]) {
        timerTypeKey = key;
      }
    });

    return timerTypeKey;
  },
}

program
  .version(process.env.npm_package_version)
  .usage('Pomodoro cli - a simple pomodoro for terminal')
  .option('-s, --shortbreak', 'Add short break timer')
  .option('-l, --longbreak', 'Add long break timer')
  .option('-t, --timer <time>', 'Add specific time in minutes', parseInt)
  .option('-p, --play-sound <filepath>', 'Play a sound file when the timer expires')
  .option('-a, --add-task <task>', 'Add a new task', 'task')
  .parse(process.argv);

const init = () => {
  const pomodoroType = APP.getPomodoroType(program);

  pomodoro.setConfig(pomodoroType, program.timer, program.playSound);

  var bar = new progress(':timerFrom [:bar] :timerTo'.red, {
    complete: '=',
    incomplete: ' ',
    width: 50,
    total: pomodoro.totalSeconds(),
    timerTo: pomodoro.getTime('timerTo'),
    timerFrom: pomodoro.getTime('timerFrom'),
    callback: notify
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

  pomodoro.tick();
};

const notify = () => {
  notifier.notify({
    title: 'Pomodoro Cli',
    message: pomodoro.getMessage(),
    icon: path.join(__dirname, 'images/pomodoro.png'),
    sound: pomodoro.playSound ? 'false' : 'true',
  });
  if (pomodoro.playSound) {
    player.play(pomodoro.playSound, function(err) {
      if (err) {
        throw err;
      }
    });
  }
  process.exit(0);

};

init();
