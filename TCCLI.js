import package_json from "./package.json" assert {type: 'json'};
import Commands from './Commands/commands.js';
import inquirer from 'inquirer';
import chalk from "chalk";

export default class TCCLI {
    constructor() {
        this.prompt = inquirer.createPromptModule();

    }

    setRunning(running) {
        this.running = running;
    }

    showStartPrompt() {
        console.log(chalk.blue("Welcome to TCCLI, the Telecommunications Command Line Interface!"));
        console.log(chalk.blue("Using version ") + chalk.greenBright(package_json.version) + chalk.blue(" of TCCLI."));
        console.log(chalk.blue("Type 'help' for a list of commands."));
    }

    log(message) {
        console.log(message);
    }

    handleInput(commandString) {
        let asyncB = false;
        if (commandString.endsWith("!")) {
            asyncB = true;
        }
        commandString = commandString.replace("!", "");
        //split arguments but don't if they are in quotes, and remove quotes
        let split = commandString.split(/ (?=(?:[^'"]|'[^']*'|"[^"]*")*$)/).map((arg) => {
            return arg.replace(/["']/g, "");
        });
        let command = split[0];
        let args = split.slice(1);
        if (command in Commands) {
            return Commands[command](this, asyncB, args);
        } else {
            chalk("Command not found", "red");
            return chalk.red("Command not found");
        }
    }

    start() {
        this.showStartPrompt();
        this.run(true);
    }

    kill() {
        process.exit();
    }

    run(running) {
        this.running = running;
        this.prompt({
            type: 'input',
            name: 'command',
            message: chalk.green('¤¤ ' + process.cwd() + '>')
        }).then((answers) => {
            return this.handleInput(answers['command']);
        }).then((output) => {
            if (output) {
                console.log(output);
            }
        }).finally(() => {
            if (this.running) {
                setImmediate(() => this.run(true));
            }
        }).catch((e) => {
            console.log(e);
            if (this.running) {
                setImmediate(() => this.run(true));
            }
        });

    }


}