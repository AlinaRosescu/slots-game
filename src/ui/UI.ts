import * as PIXI from 'pixi.js';
import { SlotMachine } from '../slots/SlotMachine';
import { AssetLoader } from '../utils/AssetLoader';
import {SoundPlayer} from '../utils/SoundPlayer';

const POSITION_OFFSET_Y: number= 50;
const SPIN_BUTTON_DEFAULT_SCALE: number= 0.8;
const SPIN_BUTTON_ZOOMED_SCALE: number= 0.9;

export class UI {
    public container: PIXI.Container;
    private app: PIXI.Application;
    private slotMachine: SlotMachine;
    private soundPlayer: SoundPlayer;
    private spinButton!: PIXI.Sprite;

    constructor(app: PIXI.Application, slotMachine: SlotMachine, soundPlayer: SoundPlayer) {
        this.app = app;
        this.slotMachine = slotMachine;
        this.soundPlayer = soundPlayer;
        this.container = new PIXI.Container();
        this.container.name = 'UILayer';

        this.createSpinButton();
    }

    private createSpinButton(): void {
        try {
            this.spinButton = new PIXI.Sprite(AssetLoader.getTexture('button_spin.png'));

            this.spinButton.anchor.set(0.5);
            this.spinButton.x = this.app.screen.width / 2;
            this.spinButton.y = this.app.screen.height - POSITION_OFFSET_Y;
            this.spinButton.scale.set(SPIN_BUTTON_DEFAULT_SCALE);

            this.spinButton.interactive = true;
            this.spinButton.cursor = 'pointer';

            this.spinButton.on('pointerdown', this.onSpinButtonClick.bind(this));
            this.spinButton.on('pointerover', this.onButtonOver.bind(this));
            this.spinButton.on('pointerout', this.onButtonOut.bind(this));

            this.container.addChild(this.spinButton);

            this.slotMachine.setSpinButton(this.spinButton);
        } catch (error) {
            console.error('Error creating spin button:', error);
        }
    }

    private onSpinButtonClick(): void {
        this.soundPlayer.play('Spin button');

        this.slotMachine.spin();
    }

    private onButtonOver(event: PIXI.FederatedPointerEvent): void {
        (event.currentTarget as PIXI.Sprite).scale.set(SPIN_BUTTON_ZOOMED_SCALE);
    }

    private onButtonOut(event: PIXI.FederatedPointerEvent): void {
        (event.currentTarget as PIXI.Sprite).scale.set(SPIN_BUTTON_DEFAULT_SCALE);
    }
}
