import TCCLI from './TCCLI.js';

process.stdin.on('keypress', function(ch, key){
    if(key && key.ctrl && key.name === 'p'){
        if(cli.running) {
            console.log("\nCaptured Ctrl+P, stopping...");
            cli.kill();
        }
    }
});

process.on('SIGINT', function() {
    if(cli.running) {
        if(!cli.inChildProcess){
            console.log("\nCaptured SIGINT, stopping...");
            cli.kill();
        }
    }
});

let cli;

function main(){
    let argvs = process.argv;
    cli = new TCCLI();
    cli.start();
}


main();