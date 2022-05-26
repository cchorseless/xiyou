import { KVHelper } from "../../../helper/KVHelper";
import { RoundConfig } from "./RoundConfig";

export class RoundState {
    static readonly iRound: string;
    static readonly iRoundCharpter: RoundConfig.ERoundCharpter = RoundConfig.ERoundCharpter.n1;
    static readonly iRoundCharpterLevel: number;

    static GetCurrentRoundType() {
        return KVHelper.KvServerConfig.building_round[this.iRound as "10"].round_type;
    }
    // - 判断是否是无尽
    static IsEndlessRound() {
        return this.GetCurrentRoundType() == "endless";
    }
}
