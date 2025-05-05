
export interface SlotMachineConfig {
    REEL_COUNT: number;
    SYMBOLS_PER_REEL: number;
    SYMBOL_SIZE: number;
    REEL_SPACING: number;
    HAS_FREE_SPINS: boolean;
    NR_OF_FREE_SPINS: number;
    SPIN_DELAY: number;
    STOP_SPIN_DELAY: number;
    SPIN_DURATION: number;
    CHECK_WIN_DELAY: number;
    BET: number;
    WINLINES: WinLine[];
}

export const defaultSlotConfig: SlotMachineConfig = {
    REEL_COUNT: 4,
    SYMBOLS_PER_REEL: 6,
    SYMBOL_SIZE: 150,
    REEL_SPACING: 10,
    HAS_FREE_SPINS: true,
    NR_OF_FREE_SPINS: 3,
    SPIN_DELAY: 300,
    STOP_SPIN_DELAY: 400,
    SPIN_DURATION: 500,
    CHECK_WIN_DELAY: 500,
    BET: 10,
    WINLINES: [
        {
            id: 1,
            line: [
                1,0,0,0,0,0,
                1,0,0,0,0,0,
                1,0,0,0,0,0,
                1,0,0,0,0,0
            ],
        },
        {
            id: 2,
            line: [
                0,1,0,0,0,0,
                0,1,0,0,0,0,
                0,1,0,0,0,0,
                0,1,0,0,0,0
            ]
        },
        {
            id: 3,
            line: [
                0,0,1,0,0,0,
                0,0,1,0,0,0,
                0,0,1,0,0,0,
                0,0,1,0,0,0
            ]
        },
        {
            id: 4,
            line: [
                0,0,0,1,0,0,
                0,0,0,1,0,0,
                0,0,0,1,0,0,
                0,0,0,1,0,0
            ]
        },
        {
            id: 5,
            line: [
                0,0,0,0,1,0,
                0,0,0,0,1,0,
                0,0,0,0,1,0,
                0,0,0,0,1,0
            ]
        },
        {
            id: 6,
            line: [
                0,0,0,0,0,1,
                0,0,0,0,0,1,
                0,0,0,0,0,1,
                0,0,0,0,0,1
            ]
        },
        {
            id: 7,
            line: [
                1,0,0,0,0,0,
                0,1,0,0,0,0,
                0,1,0,0,0,0,
                1,0,0,0,0,0
            ]
        },
        {
            id: 8,
            line: [
                0,0,0,0,0,1,
                0,0,0,0,1,0,
                0,0,0,0,1,0,
                0,0,0,0,0,1
            ]
        }
    ]
};

export interface WinLine {
    id: number;
    line: number[];
}
