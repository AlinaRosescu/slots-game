
export interface SlotMachineConfig {
    REEL_COUNT: number;
    SYMBOLS_PER_REEL: number;
    SYMBOL_SIZE: number;
    REEL_SPACING: number;
    CHANCE_OF_WINNING: number;
    SPIN_DELAY: number;
    STOP_SPIN_DELAY: number;
    SPIN_DURATION: number;
    CHECK_WIN_DELAY: number;
}

export const defaultSlotConfig: SlotMachineConfig = {
    REEL_COUNT: 4,
    SYMBOLS_PER_REEL: 6,
    SYMBOL_SIZE: 150,
    REEL_SPACING: 10,
    CHANCE_OF_WINNING: 30,
    SPIN_DELAY: 300,
    STOP_SPIN_DELAY: 400,
    SPIN_DURATION: 500,
    CHECK_WIN_DELAY: 500
};
