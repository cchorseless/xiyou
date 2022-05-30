import { KVHelper } from "../../../helper/KVHelper";
import { unit_base_equip_bag } from "../../../npc/units/common/unit_base_equip_bag";
import { unit_base_gold_bag } from "../../../npc/units/common/unit_base_gold_bag";
import { DifficultyState } from "../Difficulty/DifficultyState";
import { MapState } from "../Map/MapState";

export class RoundState {
    static iRound: string;
    static RoundPrize: string;

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


    public static createRoundMapUnit(round: string) {
        let posinfo = MapState.BaseRoomPrizeUnitRefreshZone;
        let minx = posinfo[0];
        let miny = posinfo[1];
        let maxx = posinfo[2];
        let maxy = posinfo[3];
        for (let i = 0; i < 30; i++) {
            let vv = Vector(RandomFloat(minx, maxx), RandomFloat(miny, maxy), 64);
            unit_base_gold_bag.CreateOne(vv, DOTATeam_t.DOTA_TEAM_BADGUYS, true);
            let vv1 = Vector(RandomFloat(minx, maxx), RandomFloat(miny, maxy), 64);
            unit_base_equip_bag.CreateOne(vv1, DOTATeam_t.DOTA_TEAM_BADGUYS, true);
        }
    }
}
