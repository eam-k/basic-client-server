const EventEmitter = require('events');
const readLine = require('readline');
const { getCommandArgs } = require('./utilities');

const user = new EventEmitter();
require('./simpleCLI')(user);

const lineReader = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "simple-cli>"
});

lineReader.on('line', (data) => {
    user.emit('command', getCommandArgs(data));
    lineReader.prompt();
});

lineReader.on('close',()=>{
    console.log('Have a nice day!')
})

user.on('response', (data) => {
    console.log(`${data}`);
    lineReader.prompt();
});

user.on('clear', () => {
    process.stdout.write('\033c');
});