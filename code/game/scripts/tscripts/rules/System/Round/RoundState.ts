import { KVHelper } from "../../../helper/KVHelper";
import { unit_base_equip_bag } from "../../../npc/units/common/unit_base_equip_bag";
import { unit_base_gold_bag } from "../../../npc/units/common/unit_base_gold_bag";
import { DifficultyState } from "../Difficulty/DifficultyState";
import { MapState } from "../Map/MapState";

export class RoundState {
    static iRound: string;

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
