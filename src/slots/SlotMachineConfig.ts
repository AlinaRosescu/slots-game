
export interface SlotMachineConfig {
    REEL_COUNT: number;
    SYMBOLS_PER_REEL: number;
    SYMBOL_SIZE: number;
    REEL_SPACING: number;
    CHANCE_OF_WINNING: number;
    HAS_FREE_SPINS: boolean;
    CHANCE_OF_FREE_SPINS: number;
    NR_OF_FREE_SPINS: number;
    SPIN_DELAY: number;
    STOP_SPIN_DELAY: number;
    SPIN_DURATION: number;
    CHECK_WIN_DELAY: number;
    WINLINES: Array<Array<number>>;
}

export const defaultSlotConfig: SlotMachineConfig = {
    REEL_COUNT: 4,
    SYMBOLS_PER_REEL: 6,
    SYMBOL_SIZE: 150,
    REEL_SPACING: 10,
    CHANCE_OF_WINNING: 30,
    HAS_FREE_SPINS: true,
    CHANCE_OF_FREE_SPINS: 30,
    NR_OF_FREE_SPINS: 3,
    SPIN_DELAY: 300,
    STOP_SPIN_DELAY: 400,
    SPIN_DURATION: 500,
    CHECK_WIN_DELAY: 500,
    WINLINES: [
        [
            1,0,0,0,0,0,
            1,0,0,0,0,0,
            1,0,0,0,0,0,
            1,0,0,0,0,0
        ],
        [
            0,1,0,0,0,0,
            0,1,0,0,0,0,
            0,1,0,0,0,0,
            0,1,0,0,0,0
        ],
        [
            0,0,1,0,0,0,
            0,0,1,0,0,0,
            0,0,1,0,0,0,
            0,0,1,0,0,0
        ],
        [
            0,0,0,1,0,0,
            0,0,0,1,0,0,
            0,0,0,1,0,0,
            0,0,0,1,0,0
        ],
        [
            0,0,0,0,1,0,
            0,0,0,0,1,0,
            0,0,0,0,1,0,
            0,0,0,0,1,0
        ],
        [
            0,0,0,0,0,1,
            0,0,0,0,0,1,
            0,0,0,0,0,1,
            0,0,0,0,0,1
        ],
        [
            1,0,0,0,0,0,
            0,1,0,0,0,0,
            0,1,0,0,0,0,
            1,0,0,0,0,0
        ],
        [
            0,0,0,0,0,1,
            0,0,0,0,1,0,
            0,0,0,0,1,0,
            0,0,0,0,0,1
        ]
    ]
};
