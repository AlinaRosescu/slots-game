import * as PIXI from 'pixi.js';
import { AssetLoader } from '../utils/AssetLoader';
import {Sprite, Texture} from "pixi.js";

const SYMBOL_TEXTURES = [
    'symbol1.png',
    'symbol2.png',
    'symbol3.png',
    'symbol4.png',
    'symbol5.png',
];

const SPIN_SPEED = 50; // Pixels per frame
const SLOWDOWN_RATE = 0.95; // Rate at which the reel slows down

export class Reel {
    public container: PIXI.Container;
    private symbols: PIXI.Sprite[];
    private symbolSize: number;
    private symbolCount: number;
    private speed: number = 0;
    private isSpinning: boolean = false;

    constructor(symbolCount: number, symbolSize: number) {
        this.container = new PIXI.Container();
        this.symbols = [];
        this.symbolSize = symbolSize;
        this.symbolCount = symbolCount;

        this.createSymbols();
    }

    private createSymbols(): void {
        // Create symbols for the reel, arranged horizontally
        for (let i = 0; i < this.symbolCount; i++) {
            const symbol: Sprite = this.createRandomSymbol(i);

            this.container.addChild(symbol);
            this.symbols.push(symbol);
        }
    }

    private createRandomSymbol(symbolId: number): Sprite {
        // Get a random symbol texture
        const texture: Texture = this.getRandomSymbolTexture();
        // Create a sprite with the texture
        const symbol: Sprite = new Sprite(texture);
        symbol.scale.x = symbol.scale.y = Math.min(this.symbolSize / symbol.width, this.symbolSize / symbol.height);
        symbol.x = symbolId * this.symbolSize;

        return symbol;
    }

    private getRandomSymbolTexture(): Texture {
        const randomTexture = SYMBOL_TEXTURES[Math.floor(Math.random() * SYMBOL_TEXTURES.length)];

        return AssetLoader.getTexture(randomTexture);
    }

    public update(delta: number): void {
        if (!this.isSpinning && this.speed === 0) return;

        // TODO:Move symbols horizontally

        // If we're stopping, slow down the reel
        if (!this.isSpinning && this.speed > 0) {
            this.speed *= SLOWDOWN_RATE;

            // If speed is very low, stop completely and snap to grid
            if (this.speed < 0.5) {
                this.speed = 0;
                this.snapToGrid();
            }
        }
    }

    private snapToGrid(): void {
        // TODO: Snap symbols to horizontal grid positions

    }

    public startSpin(): void {
        this.isSpinning = true;
        this.speed = SPIN_SPEED;
    }

    public stopSpin(): void {
        this.isSpinning = false;
        // The reel will gradually slow down in the update method
    }
}
