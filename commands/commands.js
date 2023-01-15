import {spawnSync, spawn, execSync} from "child_process";
import which from "which";
import chalk from "chalk";
import iconv from "iconv-lite" ;//needed for windows commands that return non-utf8

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
    if(args.length < 1) {
        return formats.error("start requires at least one argument.");
    }
    if (asyncB) {
        which(args[0]).catch((e) => args[0]).then((path) => {
            return spawn(path, args.slice(1));
        }).then((child) => {
            return child.on('error', (err) => {
                return TCCLI.log(formats.error("Error happened: " + err));
            });
        });
        return;
    }
    const resolved = which.sync(args[0], {nothrow: true});
    try {
        const child = spawnSync(resolved || args[0], args.slice(1), {
            cwd: process.cwd(), stdio: [process.stdin, process.stdout, process.stderr]
        });
        // console.log(child);
        if (child.error) {
            if (child.error.code === "ENOENT") {
                try{
                    return formats.success(iconv.decode(execSync(args.join(" "), {encoding:"buffer", cwd: process.cwd(), stdio:[]}), "cp850"));
                }catch (e) {
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