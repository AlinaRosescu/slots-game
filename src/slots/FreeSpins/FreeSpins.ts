import {Container} from "pixi.js";
import {SlotMachineConfig} from "../SlotMachineConfig";
import {FreeSpinsStartPopup} from "./FreeSpinsStartPopup";
import {FreeSpinsEndPopup} from "./FreeSpinsEndPopup";

const POSITION_OFFSET = 85;

export class FreeSpins {
    public isFreeSpins: boolean = false;
    private nrOfFreeSpinsPlayed: number = 0;
    private maxNrOfFreeSpins: number = 0;
    public container: Container;
    private startPopup: FreeSpinsStartPopup;
    private endPopup: FreeSpinsEndPopup;

    constructor(config: SlotMachineConfig, screenWidth: number, screenHeight: number) {
        this.container = new Container();
        this.container.name = 'FreeSpinsLayer';
        this.container.x =
            screenWidth / 2 - ((config.SYMBOL_SIZE * config.SYMBOLS_PER_REEL) / 2) - POSITION_OFFSET;
        this.container.y =
            screenHeight / 2 - ((config.SYMBOL_SIZE * config.REEL_COUNT + config.REEL_SPACING * (config.REEL_COUNT - 1)) / 2) - POSITION_OFFSET;
        this.maxNrOfFreeSpins = config.NR_OF_FREE_SPINS;
        this.startPopup = new FreeSpinsStartPopup(this.container, config, POSITION_OFFSET);
        this.endPopup = new FreeSpinsEndPopup(this.container, config, POSITION_OFFSET);
    }

    public start(): void {
        this.isFreeSpins = true;
        this.nrOfFreeSpinsPlayed++;
        console.log('Start FS');
        this.startPopup.showPopup();
    }

    public continue(): boolean {
        let continueFreeSpins = false;
        if (this.nrOfFreeSpinsPlayed > 0) {
            if (this.nrOfFreeSpinsPlayed < this.maxNrOfFreeSpins) {
                console.log('continue FS' + this.nrOfFreeSpinsPlayed);
                this.nrOfFreeSpinsPlayed++;
                continueFreeSpins = true;
            }
        }
        return continueFreeSpins;
    }

    public end(): void {
        console.log('End FS' + this.nrOfFreeSpinsPlayed);
        this.isFreeSpins = false;
        this.nrOfFreeSpinsPlayed = 0;
        this.endPopup.showPopup();
    }
}