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
        
        // Special-purpose registers
        this.PC = 0; // Program Counter
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
            case 'MUL':
                // !!! IMPLEMENT ME
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

        // Execute the instruction. Perform the actions for the instruction as
        // outlined in the LS-8 spec.
        switch(IR) {

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

            default:
                console.log('error');
                break;

//             ### ADD

// `ADD registerA registerB`

// Add two registers and store the result in registerA.

// Machine code:
// ```
// 10101000 00000aaa 00000bbb
// ```

// ### AND

// `AND registerA registerB`

// Bitwise-AND registerA and registerB, then store the result in
// registerA.

// Machine code:
// ```
// 10110011 00000aaa 00000bbb
// ```

// ### CALL register

// `CALL register`

// Calls a subroutine (function) at the address stored in the register.

// 1. The address of the _next_ instruction that will execute is pushed onto the
//    stack.
// 2. The PC is set to the address stored in the given register.

// Machine code:
// ```
// 01001000 00000rrr
// ```

// ### CMP

// `CMP registerA registerB`

// Compare the value in two registers.

// * If they are equal, set the Equal `E` flag to 1, otherwise set it to 0.

// * If registerA is less than registerB, set the Less-than `L` flag to 1,
//   otherwise set it to 0.

// * If registerA is greater than registerB, set the Greater-than `G` flag
//   to 1, otherwise set it to 0.

// Machine code:
// ```
// 10100000 00000aaa 00000bbb
// ```

// ### DEC

// `DEC register`

// Decrement (subtract 1 from) the value in the given register.

// Machine code:
// ```
// 01111001 00000rrr
// ```

// ### DIV

// `DIV registerA registerB`

// Divide the value in the first register by the value in the second,
// storing the result in registerA.

// If the value in the second register is 0, the system should print an
// error message and halt.

// Machine code:
// ```
// 10101011 00000aaa 00000bbb
// ```

// ### INC

// `INC register`

// Increment (add 1 to) the value in the given register.

// Machine code:
// ```
// 01111000 00000rrr
// ```

// ### INT

// `INT register`

// Issue the interrupt number stored in the given register.

// This will set the _n_th bit in the `IS` register to the value in the given
// register.

// Machine code:
// ```
// 01001010 00000rrr
// ```

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

// ### JEQ

// `JEQ register`

// If `equal` flag is set (true), jump to the address stored in the given register.

// Machine code:
// ```
// 01010001 00000rrr
// ```

// ### JGT

// `JGT register`

// If `greater-than` flag is set (true), jump to the address stored in the given
// register.

// Machine code:
// ```
// 01010100 00000rrr
// ```

// ### JLT

// `JLT register`

// If `less-than` flag is set (true), jump to the address stored in the given
// register.

// Machine code:
// ```
// 01010011 00000rrr
// ```

// ### JMP

// `JMP register`

// Jump to the address stored in the given register.

// Set the `PC` to the address stored in the given register.

// Machine code:
// ```
// 01010000 00000rrr
// ```

// ### JNE

// `JNE register`

// If `E` flag is clear (false, 0), jump to the address stored in the given
// register.

// Machine code:
// ```
// 01010010 00000rrr
// ```

// ### LD

// `LD registerA registerB`

// Loads registerA with the value at the address stored in registerB.

// This opcode reads from memory.

// Machine code:
// ```
// 10011000 00000aaa 00000bbb
// ```

// ### MOD

// `MOD registerA registerB`

// Divide the value in the first register by the value in the second,
// storing the _remainder_ of the result in registerA.

// If the value in the second register is 0, the system should print an
// error message and halt.

// Machine code:
// ```
// 10101100 00000aaa 00000bbb
// ```

// ### MUL

// `MUL registerA registerB`

// Multiply two registers together and store the result in registerA.

// Machine code:
// ```
// 10101010 00000aaa 00000bbb
// ```

// ### NOP

// `NOP`

// No operation. Do nothing for this instruction.

// Machine code:
// ```
// 00000000
// ```

// ### NOT

// `NOT register`

// Perform a bitwise-NOT on the value in a register.

// Machine code:
// ```
// 01110000 00000rrr
// ```

// ### OR

// `OR registerA registerB`

// Perform a bitwise-OR between registerA and registerB, storing the
// result in registerA.

// Machine code:
// ```
// 10110001 00000aaa 00000bbb
// ```

// ### POP

// `POP register`

// Pop the value at the top of the stack into the given register.

// 1. Copy the value from the address pointed to by `SP` to the given register.
// 2. Increment `SP`.

// Machine code:
// ```
// 01001100 00000rrr
// ```

// ### PRA

// `PRA register` pseudo-instruction

// Print alpha character value stored in the given register.

// Print to the console the ASCII character corresponding to the value in the
// register.

// Machine code:
// ```
// 01000010 00000rrr
// ```

// ### PUSH

// `PUSH register`

// Push the given register on the stack.

// 1. Decrement the `SP`.
// 2. Copy the value in the given register to the address pointed to by
//    `SP`.

// Machine code:
// ```
// 01001101 00000rrr
// ```

// ### RET

// `RET`

// Return from subroutine.

// Pop the value from the top of the stack and store it in the `PC`.

// Machine Code:
// ```
// 00001001
// ```

// ### ST

// `ST registerA registerB`

// Store value in registerB in the address stored in registerA.

// This opcode writes to memory.

// Machine code:
// ```
// 10011010 00000aaa 00000bbb
// ```

// ### SUB

// `SUB registerA registerB`

// Subtract the value in the second register from the first, storing the
// result in registerA.

// Machine code:
// ```
// 10101001 00000aaa 00000bbb
// ```

// ### XOR

// `XOR registerA registerB`

// Perform a bitwise-XOR between registerA and registerB, storing the
// result in registerA.

// Machine code:
// ```
// 10110010 00000aaa 00000bbb
        }

        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.
        let increment = IR.toString(2);
        while (increment.length < 8) increment = "0" + increment;
        this.PC = (this.PC + 1) + parseInt(increment.slice(0, 2), 2);
    }
}

module.exports = CPU;
