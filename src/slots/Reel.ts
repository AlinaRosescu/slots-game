import * as PIXI from 'pixi.js';
import { AssetLoader } from '../utils/AssetLoader';
import {BlurFilter, Sprite, Texture} from "pixi.js";
import gsap from 'gsap';

const SYMBOL_TEXTURES = [
    'symbol1.png',
    'symbol2.png',
    'symbol3.png',
    'symbol4.png',
    'symbol5.png',
];

const SPIN_SPEED = 50; // Pixels per frame
const SLOWDOWN_RATE = 0.95; // Rate at which the reel slows down
const FPS = 60; // Frames per second

export class Reel {
    public container: PIXI.Container;
    private symbols: PIXI.Sprite[];
    private symbolSize: number;
    private symbolCount: number;
    private speed: number = 0;
    private isSpinning: boolean = false;
    private position: number;
    private blurFilter: BlurFilter | undefined;
    public event: CustomEvent = new CustomEvent('snapGrid');

    constructor(symbolCount: number, symbolSize: number) {
        this.container = new PIXI.Container();
        this.symbols = [];
        this.symbolSize = symbolSize;
        this.symbolCount = symbolCount;
        this.position = 0;

        this.createSymbols();

        this.createBlurFilter();
    }

    private createSymbols(): void {
        // Create symbols for the reel, arranged horizontally
        const topSymbol: Sprite = this.createRandomSymbol(-1);
        this.addSymbol(topSymbol);

        for (let i = 0; i < this.symbolCount; i++) {
            const symbol: Sprite = this.createRandomSymbol(i);
           this.addSymbol(symbol);
        }

        const bottomSymbol: Sprite = this.createRandomSymbol(this.symbolCount);
        this.addSymbol(bottomSymbol);
    }

    private addSymbol(symbol: Sprite): void {
        this.container.addChild(symbol);
        this.symbols.push(symbol);
    }

    private createRandomSymbol(symbolIndex: number): Sprite {
        // Get a random symbol texture
        const texture: Texture = this.getRandomSymbolTexture();
        return this.createSymbol(symbolIndex, texture);
    }

    private getRandomSymbolTexture(): Texture {
        const randomTexture = SYMBOL_TEXTURES[Math.floor(Math.random() * SYMBOL_TEXTURES.length)];

        return AssetLoader.getTexture(randomTexture);
    }

    private createSymbol(symbolIndex: number, texture: Texture): Sprite {
        // Create a sprite with the texture
        const symbol: Sprite = new Sprite(texture);
        symbol.anchor.set(0.5);
        symbol.scale.x = symbol.scale.y = Math.min(this.symbolSize / symbol.width, this.symbolSize / symbol.height);
        symbol.x = symbolIndex * this.symbolSize  + this.symbolSize / 2;
        symbol.y = this.symbolSize / 2;

        return symbol;
    }

    private createBlurFilter(): void {
        // Create blur filter
        this.blurFilter = new BlurFilter();
        this.blurFilter.blurX = 0;
        this.blurFilter.blurY = 0;
    }

    public update(delta: number): void {
        if (!this.isSpinning && this.speed === 0) return;

        // Move symbols based on speed
        this.position += this.speed * delta / FPS;

        // Move symbols horizontally
        this.moveSymbols();

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

    private moveSymbols(): void {
        for (let j = 0; j < this.symbols.length; j++) {
            const symbol = this.symbols[j];
            const symbolPosition = ((j + this.position) % this.symbols.length);
            symbol.x = symbolPosition * this.symbolSize + this.symbolSize / 2;

            // Wrap around if symbol goes off screen
            if (symbol.x < -this.symbolSize * 2) {
                symbol.x += this.symbolSize * this.symbols.length;
            } else if (symbol.x > this.symbolSize * this.symbolCount) {
                symbol.x -= this.symbolSize * this.symbols.length;
            }

            // Randomize symbol if it's out of view
            if (symbol.x < -this.symbolSize ||
                symbol.x > this.symbolSize * this.symbolCount) {
                if (this.isSpinning) {
                    symbol.texture = this.getRandomSymbolTexture();
                }
            }
        }
        // Update blur based on speed
        if (this.blurFilter) {
            const blurAmount = this.speed / 5;
            this.blurFilter.blurY = blurAmount;
        }
    }

    private snapToGrid(): void {
        // Snap symbols to horizontal grid positions
        this.position = Math.round(this.position);
        // Update the symbols to match the grid position
        for (let j = 0; j < this.symbols.length; j++) {
            const symbol = this.symbols[j];
            const symbolPosition = ((j + this.position) % this.symbols.length);
            symbol.x = symbolPosition * this.symbolSize + this.symbolSize / 2;
        }
        window.dispatchEvent(this.event);
    }

    public startSpin(): void {
        this.isSpinning = true;
        this.speed = SPIN_SPEED;
        if (this.blurFilter) {
            this.container.filters = [this.blurFilter]; // Add filter only during spin
        }
    }

    public stopSpin(): void {
        this.isSpinning = false;
        // The reel will gradually slow down in the update method
        this.container.filters = []; // Remove filter when stopped
    }

    public playSymbolsWinAnimation(symbolIds: number[], onCompleteAnimation: Function | null): void {
        const sortedSymbols: Sprite[] = this.symbols.sort((a, b) => a.x - b.x);
        let onCompleteCallback: any = null;
        symbolIds.forEach((symbolId: number, index: number) => {
            if (symbolId === 1) {
                const isFinalWinSymbol = symbolIds.slice(index + 1).indexOf(1) === -1;
                if (isFinalWinSymbol) {
                    onCompleteCallback = onCompleteAnimation;
                }
                let symbolIndex = index + 1;
                gsap.to(sortedSymbols[symbolIndex].scale, {
                    x: 1.5,
                    y: 1.5,
                    duration: 0.5,
                    repeat: 1,
                    yoyo: true,
                    onComplete: onCompleteCallback
                });
            }
        });
    }
}
