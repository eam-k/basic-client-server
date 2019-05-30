const request = require('request');
const { welcomeMsg, commandsMap, validateFlags, getFlags, validateDate, formatDate } = require('./utilities');


class SimpleCLI {
    constructor(user) {
        this.user = user;
        this.firstName = 'John';
        this.lastName = 'Snow';
        this.birthday = { date: '2015-05-30T00:00:00.000', formated: 'February 25, 1988' };
        this.portNumber = 8765;
        this.user.on('command', ({ instruction, args }) => {
            if (commandsMap[instruction]) {
                this.interpreter(instruction, args);
            } else {
                this.user.emit('response', `Command: ${instruction} not recognized`);
            }
        });
        setImmediate(() => {
            this.user.emit('response', welcomeMsg({
                port: this.portNumber,
                firstName: this.firstName,
                lastName: this.lastName,
            }));
        });
    }

    interpreter(instruction, args) {
        if (!args.length) {
            this[instruction]();
            return;
        }
        let flags = getFlags(args);
        if (validateFlags(instruction, flags)) {
            flags.forEach(ele => {
                this[commandsMap[instruction][ele.flag]](ele.arg);
            });
        } else {
            this.user.emit('response', `Please use valid flags`);
        }
    }
    porth() {
        this.user.emit('response', `PORT COMMAND HELP:
        -set\tSets a new value for port\te.g. port -set 1234
        -h\tProvides available flags\te.g. port -h`);
    }
    portSet(number) {
        if (Number(number)) {
            this.portNumber = number
            this.user.emit('response', `PORT SET: Port has changed now is ${this.portNumber = number}`);
        } else {
            this.user.emit('response', `PORT SET: Please use a valid port number`);
        }
    }

    setFirstName(name) {
        this.user.emit('response', `\nFirst Name value set to ${this.firstName = name}`);
    }

    setLastName(lastname) {
        this.user.emit('response', `\nLast name value set to ${this.lastName = lastname}`);
    }

    val() {
        this.user.emit('response', `\nFirst Name: ${this.firstName}\nLast name ${this.lastName}`);
    }

    clear() {
        this.user.emit('clear');
    }

    setBirthday(arg) {
        if (validateDate(arg)) {
            const { date, formated } = formatDate(arg);
            this.birthday = { date, formated };
            this.user.emit('response', `'Birthday set to ${this.birthday.formated}`);
        } else {
            this.user.emit('response', `Please use a valid date format MM-DD-YYYY`);
        }
    }

    getBirthday() {
        this.user.emit('response', `Current date value is ${this.birthday.formated}`);
    }

    getcall() {
        const config = {
            method: 'GET',
            url: `http://localhost:${this.portNumber}/?name=${this.firstName}&lastname=${this.lastName}&birthday=${this.birthday.date}`,
            headers: {
                'Content-Type': 'application/json'
            }
        }
        this.makeAPIcall(config);
    }

    postcall() {
        const config = {
            method: 'POST',
            url: `http://localhost:${this.portNumber}/`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                "name": this.firstName,
                "lastname": this.lastName,
                "birthday": this.birthday.date
            },
            json: true
        }
        this.makeAPIcall(config);
    }

    makeAPIcall(config) {
        request(config, (err, res) => {
            if (err) {
                this.user.emit('response', `Can not complete this get call ${err}`);
            }
            this.user.emit('response', `Response from call: ${res.body}`);
        });
    }

    callh(){
        this.user.emit('response', `API CALL COMMAND HELP:\n
        getcall or postcall do not have any flags or paramters to be read.
        getcall or postcall uses values of name and birthday provided by the user.
        
        Actual values are: 
        First Name: ${this.firstName} Last Name: ${this.lastName}
        Birthday: ${this.birthday.formated }\n`)
    }

    nameh() {
        this.user.emit('response', `NAME COMMAND HELP:\n
        -firstname\tSets your first name\t\te.g. name -firstname John
        -lastname\tSets your last name\t\te.g. name -lastname Snow
        -val\t\tGet the current value\t\te.g. name -val

        It is valid use both: name -firstname Daenerys -lastname Targaryen
        Order is not required
        Use underscoe for more than two values e.g: Erick_Arthur or Martinez_Rodirguez
        Default values are: First Name: ${this.firstName} Last Name: ${this.lastName}`)
    }

    birthdayh(){
        this.user.emit('response', `BIRTHDAY COMMAND HELP:\n
        -set\t\tSets your birthday use(DD-MM-YYYY)\te.g. birthday -set 01-20-1992
        -get\t\tGet the current value\t\t\te.g. birthday -get

        Current value of data is ${this.birthday.formated}\n`)
    }
}

module.exports = (client) => new SimpleCLI(client);
