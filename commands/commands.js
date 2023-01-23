import {spawnSync, spawn, execSync, exec} from "child_process";
import which from "which";
import chalk from "chalk";
import iconv from "iconv-lite" ;
import * as os from "os";


let Commands = {
    'help': help, 'exit': exit, 'cd': cd, 'start': start, 'lp': lp, 'bing': bing, 'keep': keep
}
export default Commands

let formats = {
    'error': chalk.red,
    'success': chalk.green,
    'info': chalk.blue,
    'warning': chalk.yellow,
    'help': chalk.cyan,
}

function help(TCCLI, asyncB, args) {
    return formats.help("help") + " - " + formats.info("Shows this help message");
}

function exit(TCCLI, asyncB, args) {
    TCCLI.setRunning(false);
    return formats.success("Exiting...");
}

function cd(TCCLI, asyncB, args) {
    if (asyncB) {
        return formats.error("cd does not support async mode.");
    }
    try {
        process.chdir(args[0]);
    } catch (e) {
        return formats.error("" + e);
    }
}

function start(TCCLI, asyncB, args) {
    if (args.length < 1) {
        return formats.error("start requires at least one argument.");
    }
    if (asyncB) {
        return which(args[0])
            .catch((e) => args[0])
            .then((path) => {
                return spawn(path, args.slice(1),{detached: true, stdio: 'ignore'});
            })
            .then((child) => {
                TCCLI.addProcess(child);
                child.on('error', (e) => {
                    TCCLI.log(formats.error("Cannot start " + args[0] + " in async mode"));
                    TCCLI.removeProcess(child);
                });
                child.on('exit', (code) => {
                    TCCLI.removeProcess(child);
                });
            })
            .catch((e) => {
                return formats.error("Error happened: " + e);
            });

    }
    const resolved = which.sync(args[0], {nothrow: true});
    try {
        const child = spawnSync(resolved || args[0], args.slice(1), {
            cwd: process.cwd(), stdio: [process.stdin, process.stdout, process.stderr]
        });
        if (child.error) {
            if (child.error.code === "ENOENT") {
                try {
                    return formats.success(iconv.decode(execSync(args.join(" "), {
                        encoding: "buffer",
                        cwd: process.cwd(),
                        stdio: []
                    }), "cp850"));
                } catch (e) {
                    return formats.error("Error happened: " + iconv.decode(e.stderr, "cp850"));
                }
            } else {
                return formats.error("" + child.error);
            }
        }
    } catch (e) {
        console.log(e);
        return formats.error("" + e);
    }
}

function lp(TCCLI, asyncB, args) {
    if (asyncB) {
        return formats.error("lp does not support async mode.");
    }
    let str = "[id] | Process Name | PID";
    for (let i = 0; i < TCCLI.getProcesses().length; i++) {
        str += "\n[" + (i+1) + "] " + TCCLI.childProcesses[i].spawnfile.split('\\').reverse()[0] + " " + TCCLI.childProcesses[i].pid;
    }
    return str;
}

function bing(TCCLI, asyncB, args) {
    if (asyncB) {
        return formats.error("bing does not support async mode.");
    }
    if (args.length < 2) {
        return formats.error("bing requires at least one argument.");
    }
    switch (args[0]){
        case "-k":
            TCCLI.getProcesses().filter((child) => child.pid === parseInt(args[1])).map((child) => child.kill());
            return formats.success("Killed process with PID " + args[1]);
        case "-p":
            if(os.platform() === "win32"){
                return formats.error("bing does not support -p on Windows.");
            }
            TCCLI.getProcesses().filter((child) => child.pid === parseInt(args[1])).map((child) => child.kill("SIGSTOP"));
            return formats.success("Paused process with PID " + args[1]);
        case "-c":
            if(os.platform() === "win32"){
                return formats.error("bing does not support -c on Windows.");
            }
            TCCLI.getProcesses().filter((child) => child.pid === parseInt(args[1])).map((child) => child.kill("SIGCONT"));
            return formats.success("Continued process with PID " + args[1]);
        default:
            return formats.error("Invalid argument " + args[0]);
    }
}

function keep(TCCLI, asyncB, args) {
    if (asyncB) {
        return formats.error("keep does not support async mode.");
    }
    if (args.length < 1) {
        return formats.error("keep requires at least one argument.");
    }
    //Detach the process with Pid from the parent
    TCCLI.getProcesses().filter((child) => child.pid === parseInt(args[0])).map((child) =>{
        child.unref();
        TCCLI.removeProcess(child);
    });
    return formats.success("Detached process with PID " + args[0]);
}
