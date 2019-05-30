const moment = require('moment');


function welcomeMsg({ port, firstName, lastName }) {
    return `\n\tWelcome to my app
    These are the commands you can use\n
    \t-port\t\t( example: port -set 8000, default value is ${port} )
    \t-name\t\t( example: name -firstname ${firstName}  -lastname ${lastName} )
    \t-birthday\t( MM/DD/YYYY   example: 2/12/2019 or 25/1/2019 )
    \t-getcall\t( Makes a get call to check for your birthday )
    \t-postcall\t( Makes a post call to check for your birthday )
    
    You might use -h flag for any command.
    `
}

function getCommandArgs(data) {
    const [instruction, ...args] = data.split(" ").filter(ele => ele !== '');
    return { instruction, args }
}

/*
 * getFlags 
 * return an array of object containing the flag and the argument
 * This is just an example of how to get values from user input 
 * this was not required by the exercise but I guess it will be nice
 * to have it.
 */

function getFlags(args = []) {
    let flags = [];
    let flag;
    let arg;
    for (let i = 0; i < args.length; i++) {
        if (args[i][0] === '-') {
            flag = args[i].slice(1);
            if (args[i + 1] && args[i + 1][0] !== '-') {
                arg = args[i + 1]
            }
            flags.push({
                flag,
                arg
            });
        }
    }
    // console.log('flags', flags)
    return flags;
}

/*
 * validateFlags
 * Validate that the flags exists comparing against a map of 
 * valid commands.
*/

function validateFlags(command, flags) {
    if (Array.isArray(flags)) {
        return flags.every(ele => {
            // console.log('Validating', command, ele, commandsMap[command][ele.flag])
            return commandsMap[command][ele.flag]
        });
    }
}

/*
 * validateDate
 * Validate using moment and a default format MM-DD-YYYY
 * Moment will ingnore / or - so MM/DD/YYYY ouput is 
 * the same as  MM-DD-YYYY.
*/
function validateDate(arg) {
    console.log('Validating date',  moment(arg, "MM-DD-YYYY"));
    return moment(arg, "MM-DD-YYYY").isValid();
}

function formatDate(arg){
    const date = moment(arg, "MM-DD-YYYY");
    const formated = date.format("MMMM DD, YYYY");
    console.log('Date', date)
    return {
        date,
        formated
    }
}
const commandsMap = {
    port: {
        h: 'porth',
        set: 'portSet',
    },
    name: {
        h: 'nameh',
        firstname: 'setFirstName',
        lastname: 'setLastName',
        val: 'val',
    },
    birthday: {
        set: 'setBirthday',
        get: 'getBirthday',
        h: 'birthdayh',
    },
    getcall: {
        h: 'callh',
    },
    postcall: {
        h: 'callh',
    },
    clear: {
        h: {},
    },
    help: {
        h: {},
    },
}


module.exports = {
    welcomeMsg,
    commandsMap,
    getCommandArgs,
    validateFlags,
    getFlags,
    validateDate,
    formatDate,
}