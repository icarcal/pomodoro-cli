#!/usr/bin/env node
'use strict';

const process = require('process');
const path = require('path');
const notifier = require('node-notifier');
const progress = require('progress');
const colors = require('colors');
const program = require('commander');
const pomodoro = require('./models/pomodoro');
const { spawn } = require('child_process');

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
  .option('--player-binary <name>', 'System binary to use for playing sounds, default auto selects')
  .option('--start-command <filepath>', 'Execute a shell command ansynchronously at the start of the timer. WARNING: The command is passed directly to a shell with the same user permissions this program runs under -- use with caution!')
  .option('--end-command <filepath>', 'Execute a shell command ansynchronously at the end of the timer. WARNING: The command is passed directly to a shell with the same user permissions this program runs under -- use with caution!')
  .option('--interrupt-command <filepath>', 'Execute a shell command prior to exiting from a SIGINT signal. WARNING: The command is passed directly to a shell with the same user permissions this program runs under -- use with caution!')
  .option('-c, --progress-color <color>', 'Color of the progress bar, as a valid colors.js text color', 'red')
  .option('-a, --add-task <task>', 'Add a new task', 'task')
  .parse(process.argv);

const playerArgs = {};
if (program.playerBinary) {
  playerArgs.player = program.playerBinary;
}
const player = require('play-sound')(playerArgs);

const init = () => {

  if (program.startCommand) {
    runCommand(program.startCommand);
  }

  const pomodoroType = APP.getPomodoroType(program);

  pomodoro.setConfig(pomodoroType, program.timer);

  var bar = new progress(':timerFrom [:bar] :timerTo'[program.progressColor], {
    complete: '=',
    incomplete: ' ',
    width: process.stdout.columns,
    total: pomodoro.totalSeconds(),
    timerTo: pomodoro.getTime('timerTo'),
    timerFrom: pomodoro.getTime('timerFrom'),
    callback: notify
  });

  if (program.interruptCommand) {
    process.on('SIGINT', function() {
      runCommand(program.interruptCommand);
      // 130 is the exit code for SIGINT.
      process.exit(130);
    });
  }

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
    sound: program.playSound ? 'false' : 'true',
  });
  if (program.playSound) {
    player.play(program.playSound, function(err) {
      if (err) {
        throw err;
      }
    });
  }
  if (program.endCommand) {
    runCommand(program.endCommand);
  }
  process.exit(0);

};

const runCommand = (command) => {
  const child = spawn(command, {
    stdio: 'ignore',
    shell: true,
    detached: true,
  });
  child.on('error', function (err) {
    throw err;
  });
}

init();
