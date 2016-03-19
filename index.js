#!/usr/bin/env node
'use strict';

const path = require('path');
const notifier = require('node-notifier');
const moment = require('moment');
const progress = require('node-progress-bars');
const args = process.argv.slice(2);
var timerTo;
var timerFrom;

const getTime = (timer) => {
    return pad(timer.minutes(),0,2)+':'+pad(timer.seconds(),0,2);
};

const pad = (value, fillWith, fillValue) => {
    value = String(value);
    fillWith = String(fillWith).repeat(String(fillValue));
    value = fillWith.substring(0, fillWith.length - value.length)+value;
    return value;
};

const tick = (bar) => {
    bar.tick(1, {
        timerFrom: getTime(timerFrom),
        timerTo: getTime(timerTo)
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

    timerFrom.add(1, 's');
};

const init = () => {
    if(args.length === 0){
        timerTo = moment.duration(5, 'seconds');
        timerFrom = moment.duration(0, 'seconds');
    }

    var bar = new progress({
        schema: ':timerFrom.red [:bar].red :timerTo.red',
        filled: '=',
        blank: ' ',
        width: 20,
        total: timerTo.asSeconds()+1,
        timerTo: getTime(timerTo),
        timerFrom: getTime(timerFrom)
    });

    setInterval(() => {
        tick(bar);
    },1000);
}

init();
