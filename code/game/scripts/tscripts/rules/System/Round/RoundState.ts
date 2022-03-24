import { KVHelper } from "../../../helper/KVHelper";

export class RoundState{

    static readonly iRound: string;
    
    static GetCurrentRoundShow() {
        return KVHelper.KvServerConfig.building_round[this.iRound as "10"].round_show;
    }
    static GetCurrentRoundType() {
        return KVHelper.KvServerConfig.building_round[this.iRound as "10"].round_type;
    }
    // - 判断是否是无尽
    static IsEndlessRound() {
        return this.GetCurrentRoundType() == 'endless'
    }
}