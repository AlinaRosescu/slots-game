import * as PIXI from 'pixi.js';
import 'pixi-spine';
import { Reel } from './Reel';
import {SoundPlayer} from '../utils/SoundPlayer';
import { AssetLoader } from '../utils/AssetLoader';
import {Spine} from "pixi-spine";
import {SlotMachineConfig} from "./SlotMachineConfig";

const POSITION_OFFSET = 20;

export class SlotMachine {
    public container: PIXI.Container;
    public winAnimationContainer: PIXI.Container;
    private config: SlotMachineConfig;
    private reelsContainer: PIXI.Container;
    private reels: Reel[];
    private isSpinning: boolean = false;
    private spinButton: PIXI.Sprite | null = null;
    private frameSpine: Spine | null = null;
    private winAnimation: Spine | null = null;
    private soundPlayer: SoundPlayer;
    private reelHeight: number;

    constructor(config: SlotMachineConfig, screenWidth: number, screenHeight: number, soundPlayer: SoundPlayer) {
        this.config = config;
        this.reelHeight = this.config.SYMBOL_SIZE;
        this.soundPlayer = soundPlayer;
        this.container = new PIXI.Container();
        this.reelsContainer = new PIXI.Container();
        this.winAnimationContainer = new PIXI.Container();
        this.reels = [];

        // Center the slot machine
        this.container.x = this.winAnimationContainer.x =
            screenWidth / 2 - ((this.config.SYMBOL_SIZE * this.config.SYMBOLS_PER_REEL) / 2);
        this.container.y = this.winAnimationContainer.y =
            screenHeight / 2 - ((this.reelHeight * this.config.REEL_COUNT + this.config.REEL_SPACING * (this.config.REEL_COUNT - 1)) / 2);

        this.createBackground();

        this.createReels();

        this.createReelsMask();

        this.initSpineAnimations();
    }

    private createBackground(): void {
        try {
            const width = this.config.SYMBOL_SIZE * this.config.SYMBOLS_PER_REEL + POSITION_OFFSET * 2; // Width now based on symbols per reel
            const height = this.reelHeight * this.config.REEL_COUNT + this.config.REEL_SPACING * (this.config.REEL_COUNT - 1) + POSITION_OFFSET * 2 // Height based on reel count
            const background = new PIXI.Graphics();
            background.beginFill(0x000000, 0.5);
            background.drawRect(
                POSITION_OFFSET * -1,
                POSITION_OFFSET * -1,
                width,
                height
            );
            background.endFill();
            this.container.addChild(background);
        } catch (error) {
            console.error('Error creating background:', error);
        }
    }

    private createReels(): void {
        this.container.addChild(this.reelsContainer);
        // Create each reel
        for (let i = 0; i < this.config.REEL_COUNT; i++) {
            const reel = new Reel(this.config.SYMBOLS_PER_REEL, this.config.SYMBOL_SIZE);
            reel.container.y = i * (this.reelHeight + this.config.REEL_SPACING);
            this.reelsContainer.addChild(reel.container);
            this.reels.push(reel);

            if (i < this.config.REEL_COUNT - 1) {
                this.createReelDivider(reel);
            }
        }
    }

    private createReelDivider(reel: Reel): void {
        const dividerGraphic = new PIXI.Graphics();
        dividerGraphic.beginFill(0xFFB1D2, 1);
        dividerGraphic.drawRect(
            POSITION_OFFSET * -1,
            POSITION_OFFSET * -1,
            this.config.SYMBOL_SIZE * this.config.SYMBOLS_PER_REEL + POSITION_OFFSET * 2, // Width now based on symbols per reel
            this.config.REEL_SPACING
        );
        dividerGraphic.endFill();
        dividerGraphic.y = reel.container.y + this.reelHeight + POSITION_OFFSET;
        this.reelsContainer.addChild(dividerGraphic);
    }

    private createReelsMask(): void {
        const mask = new PIXI.Graphics();
        mask.beginFill(0xffffff);
        mask.drawRect(
            POSITION_OFFSET * -1,
            0,
            this.config.SYMBOL_SIZE * this.config.SYMBOLS_PER_REEL + POSITION_OFFSET * 2,
            (this.config.SYMBOL_SIZE + this.config.REEL_SPACING) * this.config.REEL_COUNT
        );
        mask.endFill();
        this.reelsContainer.mask = mask;
        this.reelsContainer.addChild(mask);
    }

    public update(delta: number): void {
        // Update each reel
        for (const reel of this.reels) {
            reel.update(delta);
        }
    }

    public spin(): void {
        if (this.isSpinning) return;

        this.isSpinning = true;

        // Play spin sound
        this.soundPlayer.play('Reel spin');

        // Disable spin button
        if (this.spinButton) {
            this.spinButton.texture = AssetLoader.getTexture('button_spin_disabled.png');
            this.spinButton.interactive = false;
        }

        for (let i = 0; i < this.reels.length; i++) {
            setTimeout(() => {
                this.reels[i].startSpin();
            }, i * this.config.SPIN_DELAY);
        }

        // Stop all reels after a delay
        setTimeout(() => {
            this.stopSpin();
        }, this.config.SPIN_DURATION + (this.reels.length - 1) * this.config.SPIN_DELAY);
    }

    public stopSpin(): void {
        for (let i = 0; i < this.reels.length; i++) {
            setTimeout(() => {
                this.reels[i].stopSpin();

                // If this is the last reel, check for wins and enable spin button
                if (i === this.reels.length - 1) {
                    setTimeout(() => {
                        // Stop spin sound
                        this.soundPlayer.stop('Reel spin');
                        this.checkWin();
                        this.isSpinning = false;

                        if (this.spinButton) {
                            this.spinButton.texture = AssetLoader.getTexture('button_spin.png');
                            this.spinButton.interactive = true;
                        }
                    }, this.config.CHECK_WIN_DELAY);
                }
            }, i * this.config.STOP_SPIN_DELAY);
        }
    }

    private checkWin(): void {
        // Simple win check - just for demonstration
        const randomWin = Math.random() < this.config.CHANCE_OF_WINNING; // chance of winning

        if (randomWin) {
            this.soundPlayer.play('win');
            console.log('Winner!');
            // Play the win animation found in "big-boom-h" spine
            this.playWinAnimation();
        }
    }

    private playWinAnimation(): void {
        if (this.winAnimation) {
            if (this.winAnimation.state.hasAnimation('start')) {
                this.winAnimation.state.setAnimation(0, 'start', false);
                this.winAnimation.state.addListener({
                    complete: () => {
                        if (this.winAnimation) {
                            this.winAnimation.state.clearTrack(0);
                            this.winAnimation.visible = false;
                        }
                    }
                });
                this.winAnimation.visible = true;
            }
        }
    }

    public setSpinButton(button: PIXI.Sprite): void {
        this.spinButton = button;
    }

    private initSpineAnimations(): void {
        try {
            const frameSpineData = AssetLoader.getSpine('base-feature-frame.json');
            if (frameSpineData) {
                this.frameSpine = new Spine(frameSpineData.spineData);

                this.frameSpine.y = (this.reelHeight * this.config.REEL_COUNT + this.config.REEL_SPACING * (this.config.REEL_COUNT - 1)) / 2;
                this.frameSpine.x = (this.config.SYMBOL_SIZE * this.config.SYMBOLS_PER_REEL) / 2;
                this.frameSpine.scale.x  = 0.8;
                this.frameSpine.scale.y  = 0.95;

                if (this.frameSpine.state.hasAnimation('idle')) {
                    this.frameSpine.state.setAnimation(0, 'idle', true);
                }

                this.container.addChild(this.frameSpine);
            }

            const winSpineData = AssetLoader.getSpine('big-boom-h.json');
            if (winSpineData) {
                this.winAnimation = new Spine(winSpineData.spineData);

                this.winAnimation.x = (this.config.SYMBOL_SIZE * this.config.SYMBOLS_PER_REEL) / 2;
                this.winAnimation.y = (this.reelHeight * this.config.REEL_COUNT + this.config.REEL_SPACING * (this.config.REEL_COUNT - 1)) / 2;

                this.winAnimation.visible = false;

                this.winAnimationContainer.addChild(this.winAnimation);
            }
        } catch (error) {
            console.error('Error initializing spine animations:', error);
        }
    }
}
