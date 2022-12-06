export module ShareConfig {
    export enum ERarity {
        D = 1,
        C = 2,
        B = 3,
        A = 4,
        S = 10,
        SS = 11,
    }

    export function ToRarityNumber(rarity: ERarity) {
        return Number(ERarity[rarity]) || -1;
    }
}