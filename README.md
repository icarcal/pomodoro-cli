## :tomato: Pomodoro cli :tomato:

Simple timer for [pomodoro technique]

[pomodoro technique]: <http://pomodorotechnique.com/>

```
  Usage: index Pomodoro cli - a simple pomodoro for terminal

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -s, --shortbreak       Add short break timer
    -l, --longbreak        Add long break timer
    -t, --timer <time>     Add specific time in minutes
    -a, --add-task <task>  Add a new task
 	  -p, --play-sound <filepath>   Play a sound file when the timer expires
    --player-binary <name>        System binary to use for playing sounds, default auto selects
   	--start-command <filepath>    Execute a shell command ansynchronously at the start of the timer. WARNING: The command is passed directly to a shell with the same user permissions this program runs under -- use with caution!
    --end-command <filepath>      Execute a shell command ansynchronously at the end of the timer. WARNING: The command is passed directly to a shell with the same user permissions this program runs under -- use with caution!
    -c, --progress-color <color>  Color of the progress bar, as a valid colors.js text color (default: "red")
```
