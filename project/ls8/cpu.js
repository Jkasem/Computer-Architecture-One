/**
 * LS-8 v2.0 emulator skeleton code
 */

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
        this.reg[7] = 0xf4;
        // Special-purpose registers
        this.PC = 0; // Program Counter
        this.FL = 0b00000000; //flag
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
        this.clock = setInterval(() => {
            this.tick();
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
            case 'ADD':
                return (this.ram.read(regA) + this.ram.read(regB));
                break;
            case 'SUB':
                return (this.ram.read(regA) - this.ram.read(regB));
                break;
            case 'MUL':
                return (this.ram.read(regA) * this.ram.read(regB));
                break;
            case 'DIV':
                if (this.ram.read(regB) === 0) {
                    process.exit();
                    console.error('no divide by 0')
                }
                else return (this.ram.read(regA) / this.ram.read(regB));
                break;
            case 'MOD':
                if (this.ram.read(regB) === 0) {
                    process.exit();
                    console.error('no divide by 0')
                }
                else return (this.ram.read(regA) % this.ram.read(regB));
                break;
            case 'INC':
                return (this.ram.read(regA) + 1);
                break;
            case 'DEC':
                return (this.ram.read(regA) - 1);
                break;
            case 'CMP':
                // * If they are equal, set the Equal `E` flag to 1, otherwise set it to 0.
                if (regA === regB) this.FL = 0b00000001;
                // * If registerA is less than registerB, set the Less-than `L` flag to 1,
                //   otherwise set it to 0.
                if (regA < regB) this.FL = 0b00000100;
                // * If registerA is greater than registerB, set the Greater-than `G` flag
                //   to 1, otherwise set it to 0.
                if (regA > regB) this.FL = 0b00000010;
                break;
        }
    }

    /**
     * Advances the CPU one cycle
     */
    tick() {
        // Load the instruction register (IR--can just be a local variable here)
        // from the memory address pointed to by the PC. (I.e. the PC holds the
        // index into memory of the instruction that's about to be executed
        // right now.)
        const IR = this.ram.mem[this.PC];

        // Debugging output
        //console.log(`${this.PC}: ${IR.toString(2)}`);

        // Get the two bytes in memory _after_ the PC in case the instruction
        // needs them.

        const operandA = this.ram.read(this.PC + 1);
        const operandB = this.ram.read(this.PC + 2);

        let continueNext = true;

        // Execute the instruction. Perform the actions for the instruction as
        // outlined in the LS-8 spec.
        switch(IR) {

            //ADD
            case 168:
                this.ram.write(operandA, this.alu('ADD', operandA, operandB));
                break;

            //DEC
            case 121:
                this.ram.write(operandA, this.alu('DEC', operandA));
                break;

            //DIV
            case 171:
                this.ram.write(operandA, this.alu('DIV', operandA, operandB));
                break;

            //INC
            case 120:
                this.ram.write(operandA, this.alu('INC', operandA));
                break;

            //MUL
            case 170:
                this.ram.write(operandA, this.alu('MUL', operandA, operandB));
                break;

            //CMP
            case 160:
                this.alu('CMP', this.ram.read(operandA), this.ram.read(operandB));
                break;

            //SUB
            case 169:
                this.ram.write(operandA, this.alu('SUB', operandA, operandB));
                break;

            //PRN
            case 67:
                console.log(this.ram.read(operandA));
                break;

            //HLT
            case 1:
                this.stopClock();
                break;

            //LDI
            case 153:
                this.ram.write(operandA, operandB);
                break;

            //CALL
            case 72:
                this.reg[7]--;
                this.ram.write(this.reg[7], this.PC + 2);
                this.PC = this.ram.read(operandA);
                continueNext = false;
                break;

            //RET
            case 0b00001001:
                this.PC = this.ram.read(this.reg[7]);
                this.reg[7]++;
                continueNext = false;
                break;

            //PUSH
            case 77:
                this.reg[7]--;
                this.ram.write(this.reg[7], this.ram.read(operandA));
                break;

            //POP
            case 76:
                this.ram.write(operandA, this.ram.read(this.reg[7]));
                this.reg[7]++;
                break;

            //JMP
            case 0b01010000:
                this.PC = this.ram.read(operandA);
                continueNext = false;
                break;

            //JEQ
            case 0b01010001:
                if (this.FL === 1) {
                    this.PC = this.ram.read(operandA);
                    continueNext = false;
                }
                break;

            //JNE
            case 0b001010010:
                if (this.FL != 1) {
                    this.PC = this.ram.read(operandA);
                    continueNext = false;
                }
                break;

            //AND
            case 0b10110011:
                this.ram.write(operandA, this.ram.read(operandA) & this.ram.read(operandB));
                break;

            //JGT
            case 0b01010100:
                if (this.FL === 2) {
                    this.PC = this.ram.read(operandA);
                    continueNext = false;
                }
                break;

            //JLT
            case 0b01010011:
                if (this.FL === 4) {
                    this.PC = this.ram.read(operandA);
                    continueNext = false;
                }
                break;

            //LD
            case 0b10011000:
                this.ram.write(operandB, this.ram.read(operandA));
                break;

            //MOD
            case 0b10101100:
                this.ram.write(operandA, this.alu('MOD', operandA, operandB));
                break;

            //NOP
            case 0b00000000:
                break;

            //NOT
            case 0b01110000:
                this.ram.write(operandA, ~ this.ram.read(operandA));
                break;

            //OR
            case 0b10110001:
                this.ram.write(operandA, this.ram.read(operandA) | this.ram.read(operandB));
                break;

            //ST
            case 0b10011010:
                this.ram.write(operandA, this.ram.read(operandB));
                break;

            //XOR
            case 0b10110010:
                this.ram.write(operandA, this.ram.read(operandA) ^ this.ram.read(operandB));
                break;

            // ### INT

            // `INT register`

            // Issue the interrupt number stored in the given register.

            // This will set the _n_th bit in the `IS` register to the value in the given
            // register.

            // Machine code:
            // ```
            // 01001010 00000rrr
            // ```

            //INT
            case 0b01001010:
            this.ram.write(operandA, this.ram.read(this.reg[7]));
            this.reg[7]++;
            break;

            // ### IRET

            // `IRET`

            // Return from an interrupt handler.

            // The following steps are executed:

            // 1. Registers R6-R0 are popped off the stack in that order.
            // 2. The `FL` register is popped off the stack.
            // 3. The return address is popped off the stack and stored in `PC`.
            // 4. Interrupts are re-enabled

            // Machine code:
            // ```
            // 00001011
            // ```


            //IRET
            case 0b00001011:
            this.ram.write(operandA, this.ram.read(this.reg[7]));
            this.reg[7]++;
            break;


// ### PRA

// `PRA register` pseudo-instruction

// Print alpha character value stored in the given register.

// Print to the console the ASCII character corresponding to the value in the
// register.

// Machine code:
// ```
// 01000010 00000rrr
// ```


//PRA
case 0b01000010:
this.ram.write(operandA, this.ram.read(this.reg[7]));
this.reg[7]++;
break;

            default:
                console.log('error');
                break;
        }

        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.
        if (continueNext) {
            let increment = IR.toString(2);
            while (increment.length < 8) increment = "0" + increment;
            this.PC = (this.PC + 1) + parseInt(increment.slice(0, 2), 2);
        }
    }
}

module.exports = CPU;
