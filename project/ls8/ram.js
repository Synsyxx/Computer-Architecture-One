/**
 * RAM access
 */
class RAM {
    constructor(size) {
        this.mem = new Array(size);
        this.mem.fill(0);
    }

    /**
     * Write (store) MDR value at address MAR
     * 
     * @return MDR
     */
    write(MAR, MDR) {
        return this.access(MAR, MDR, true);
    }

    /**
     * Read (load) MDR value from address MAR
     * 
     * @returns MDR
     */
    read(MAR) {
        return this.access(MAR, null, false);
    }
}

module.exports = RAM;