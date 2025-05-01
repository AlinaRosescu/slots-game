
export class FreeSpins {
    public isFreeSpins: boolean = false;
    private nrOfFreeSpins: number = 0;
    private maxNrOfFreeSpins: number = 0;

    constructor(maxNrOfFreeSpins: number) {
        this.maxNrOfFreeSpins = maxNrOfFreeSpins;
    }

    public start(): void {
        this.isFreeSpins = true;
        this.nrOfFreeSpins++;
        console.log('Start FS');
    }

    public continue(): boolean {
        let continueFreeSpins = false;
        if (this.nrOfFreeSpins > 0) {
            if (this.nrOfFreeSpins < this.maxNrOfFreeSpins) {
                console.log('continue FS' + this.nrOfFreeSpins);
                this.nrOfFreeSpins++;
                continueFreeSpins = true;
            } else {
                console.log('End FS' + this.nrOfFreeSpins);
                this.isFreeSpins = false;
                this.nrOfFreeSpins = 0;
            }
        }
        return continueFreeSpins;
    }
}