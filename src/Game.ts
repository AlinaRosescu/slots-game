import * as PIXI from 'pixi.js';
import { SlotMachine } from './slots/SlotMachine';
import { AssetLoader } from './utils/AssetLoader';
import { UI } from './ui/UI';
import {defaultSlotConfig} from "./slots/SlotMachineConfig";
import {FreeSpins} from "./slots/FreeSpins/FreeSpins";
import {ServerData} from "./slots/Server/ServerData";

const APP_WIDTH = 1280;
const APP_HEIGHT = 800;

export class Game {
    private app: PIXI.Application;
    private slotMachine!: SlotMachine;
    private ui!: UI;
    private assetLoader: AssetLoader;

    constructor() {
        this.app = new PIXI.Application({
            width: APP_WIDTH,
            height: APP_HEIGHT,
            backgroundColor: 0x1099bb,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });
         (globalThis as any).__PIXI_APP__ = this.app; // eslint-disable-line

        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.appendChild(this.app.view as HTMLCanvasElement);
        }

        this.assetLoader = new AssetLoader();

        this.init = this.init.bind(this);
        this.resize = this.resize.bind(this);

        window.addEventListener('resize', this.resize);

        this.resize();
    }

    public async init(): Promise<void> {
        try {
            await this.assetLoader.loadAssets();
            const soundPlayer = await this.assetLoader.loadSounds();

            const server: ServerData = new ServerData(defaultSlotConfig);

            let freeSpins = undefined;
            if (defaultSlotConfig.HAS_FREE_SPINS) {
                freeSpins = new FreeSpins(defaultSlotConfig, APP_WIDTH, APP_HEIGHT);
            }
            this.slotMachine = new SlotMachine(defaultSlotConfig, APP_WIDTH, APP_HEIGHT, soundPlayer, server, freeSpins);
            this.app.stage.addChild(this.slotMachine.container);

            this.ui = new UI(this.app, this.slotMachine, soundPlayer);
            this.app.stage.addChild(this.ui.container);

            this.app.stage.addChild(this.slotMachine.winAnimationContainer);
            this.app.ticker.add(this.update.bind(this));

            if (freeSpins) {
                this.app.stage.addChild(freeSpins.container);
            }

            console.log('Game initialized successfully');
        } catch (error) {
            console.error('Error initializing game:', error);
        }
    }

    private update(delta: number): void {
        if (this.slotMachine) {
            this.slotMachine.update(delta);
        }
    }

    private resize(): void {
        if (!this.app || !this.app.renderer) return;

        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;

        const gameContainerWidth = gameContainer.clientWidth;
        const gameContainerHeight = gameContainer.clientHeight;

        // Calculate scale to fit the container while maintaining aspect ratio
        const scale = Math.min(gameContainerWidth / APP_WIDTH, gameContainerHeight / APP_HEIGHT);

        this.app.stage.scale.set(scale);

        // Center the stage
        this.app.renderer.resize(gameContainerWidth, gameContainerHeight);
        this.app.stage.position.set(gameContainerWidth / 2, gameContainerHeight / 2);
        this.app.stage.pivot.set(APP_WIDTH / 2, APP_HEIGHT / 2);
    }
}
