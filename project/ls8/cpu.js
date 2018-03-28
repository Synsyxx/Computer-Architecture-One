/**
 * LS-8 v2.0 emulator skeleton code
 */

const HLT = 0b00000001;
const LDI = 0b10011001;
const MUL = 0b10101010;
const PRN = 0b01000011;
const POP = 0b01001100;
const PUSH = 0b01001101;
const DEC = 0b01111001;
const INC = 0b01111000;

const SP = 0x07;
/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {

    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;

        this.reg = new Array(8).fill(0); // General-purpose registers R0-R7

        this.reg[SP] = 0xf4;
        
        // Special-purpose registers
        this.reg.PC = 0; // Program Counter
    }
    
    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        this.ram.write(address, value);
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        const _this = this;

        this.clock = setInterval(() => {
            _this.tick();
        }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
    }

    /**
     * Stops the clock
     */
    stopClock() {
        clearInterval(this.clock);
    }

    /**
     * ALU functionality
     *
     * The ALU is responsible for math and comparisons.
     *
     * If you have an instruction that does math, i.e. MUL, the CPU would hand
     * it off to it's internal ALU component to do the actual work.
     *
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
    alu(op, regA, regB) {
        switch (op) {
            case 'DEC':
                this.reg[regA] = this.reg[regA] - 1;
                break;

            case 'INC':
                this.reg[regA] = this.reg[regA] + 1;
                break;

            case 'MUL':
                this.reg[regA] = this.reg[regA] * this.reg[regB];
                break;
        }
    }

    /**
     * Advances the CPU one cycle
     */
    tick() {
        // Load the instruction register (IR--can just be a local variable here)
        // from the memory address pointed to by the PC. (I.e. the PC holds the
        // index into memory of the next instruction.)
        let IR = this.ram.read(this.reg.PC);

        // Debugging output
        //console.log(`${this.reg.PC}: ${IR.toString(2)}`);

        // Get the two bytes in memory _after_ the PC in case the instruction
        // needs them.

        let operandA = this.ram.read(this.reg.PC + 1);
        let operandB = this.ram.read(this.reg.PC + 2);

        // Execute the instruction. Perform the actions for the instruction as
        // outlined in the LS-8 spec.

        const handle_HLT = () => {
            this.stopClock();
        };

        const handle_LDI = (operandA, operandB) => {
            this.reg[operandA] = operandB;
        };

        const handle_PRN = operandA => {
            console.log(this.reg[operandA]);
        };

        const handle_MUL = (operandA, operandB) => {
            this.alu('MUL', operandA, operandB);
        };

        const handle_ERROR = IR => {
            console.log('Unkown instruction: ' + IR.toString(2));
            this.stopClock();
        };

        const _pop = () => {
            const value = this.ram.read(this.reg[SP]);
            handle_INC();
            return value;
        };

        const handle_POP = () => {
            this.reg[operandA] = _pop();
        };

        const _push = value => {
            handle_DEC();
            this.ram.write(this.reg[SP], value);
        };

        const handle_PUSH = operandA => {
            _push(this.reg[operandA]);
        };

        const handle_DEC = () => {
            this.alu('DEC', SP);
        };

        const handle_INC = () => {
            this.alu('INC', SP);
        };

        const branchTable = {
            [LDI]: handle_LDI,
            [HLT]: handle_HLT,
            [PRN]: handle_PRN,
            [MUL]: handle_MUL,
            [POP]: handle_POP,
            [PUSH]: handle_PUSH,
            [DEC]: handle_DEC,
            [INC]: handle_INC
        };

        if (Object.keys(branchTable).includes(IR.toString())) {
        branchTable[IR](operandA, operandB);
        } else {
            handle_ERROR(IR);
        }
        
        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.

        this.reg.PC += (IR >>> 6) + 1;
    }
}

module.exports = CPU;
