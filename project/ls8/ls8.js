const readline = require('readline');
const fs = require('fs');
const RAM = require('./ram');
const CPU = require('./cpu');

/**
 * Load an LS8 program into memory
 *
 * TODO: load this from a file on disk instead of having it hardcoded
 */
function loadMemory(cpu, filename) {

    // Hardcoded program to print the number 8 on the console

    /*
    const program = [ // print8.ls8
        "10011001", // LDI R0,8  Store 8 into R0
        "00000000",
        "00001000",
        "01000011", // PRN R0    Print the value in R0
        "00000000",
        "00000001"  // HLT       Halt and quit
    ];
    */
   /*
    const program = [ // mult.ls8
        "10011001",
        "00000000",
        "00001000",
        "10011001",
        "00000001",
        "00001001",
        "10101010",
        "00000000",
        "00000001",
        "01000011",
        "00000000",
        "00000001"
    ];

    // Load the program into the CPU's memory a byte at a time
    for (let i = 0; i < program.length; i++) {
        cpu.poke(i, parseInt(program[i], 2));
    }
    */

    var lineReader = readline.createInterface({
        input: fs.createReadStream(filename)
    });

    let address = 0;
  
    lineReader.on('line', function (line) {
        //console.log('Line from file:', line);

        let str = line.split('#')[0].slice(0, 8);

        let byte = parseInt(str, 2);

        if (!isNaN(byte)) {
            cpu.poke(address++, byte);
        }
    });

    lineReader.on('close', function() {
        cpu.startClock();
    });
}

/**
 * Main
 */

let ram = new RAM(256);
let cpu = new CPU(ram);

if (process.argv.length != 3) {
    console.error("usage: node ls8 filename");
    process.exit(1);
}

loadMemory(cpu, process.argv[2]);
