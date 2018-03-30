// const readline = require('readline');
const fs = require('fs');
const RAM = require('./ram');
const CPU = require('./cpu');

/**
 * Load an LS8 program into memory
 *
 * TODO: load this from a file on disk instead of having it hardcoded
 */
function loadMemory(cpu) {
    let program = [];
    if (process.argv.length === 3) {
        const lineReader = require('readline').createInterface({
            input: fs.createReadStream(process.argv[2])
        });

        lineReader.on('line', function(line) {
            let str = line.split('#')[0].slice(0, 8);

            if (str.length > 1) {
                program.push(str);
            } else {
                return;
            }
        });

        lineReader.on('close', function() {
            processProgram(program, cpu);
        });
    } else {
        console.log('Error: Please include a file name.');
    }
}

function processProgram(arr, cpu) {
    for (let i = 0; i < arr.length; i++) {
        cpu.poke(i, parseInt(arr[i], 2));
    }
    cpu.startClock();
}

/**
 * Main
 */

let ram = new RAM(256);
let cpu = new CPU(ram);

/*if (process.argv.length != 3) {
    console.error("usage: node ls8 filename");
    process.exit(1);
} */

loadMemory(cpu);
// loadMemory(cpu, process.argv[2]);
