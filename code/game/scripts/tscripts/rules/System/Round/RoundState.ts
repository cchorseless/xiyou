import { KVHelper } from "../../../helper/KVHelper";
import { DifficultyState } from "../Difficulty/DifficultyState";

export class RoundState {
    static  iRound: string;

    static GetCurrentRoundType() {
        return KVHelper.KvServerConfig.building_round[this.iRound as "10"].round_type;
    }
    // - 判断是否是无尽
    static IsEndlessRound() {
        return this.GetCurrentRoundType() == "endless";
    }

    static GetFirstRoundid() {
        return DifficultyState.DifficultyChapter + "_1";
    }
}
