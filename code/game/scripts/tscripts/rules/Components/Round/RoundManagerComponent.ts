import { KVHelper } from "../../../helper/KVHelper";
import { building_round_challenge } from "../../../kvInterface/building/building_round_challenge";
import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { ET } from "../../Entity/Entity";
import { RoundState } from "../../System/Round/RoundState";
import { RoundSystem } from "../../System/Round/RoundSystem";
import { ERound } from "./ERound";
import { ERoundChallenge } from "./ERoundChallenge";

export class RoundManagerComponent extends ET.Component {

    readonly PlayerID: number;
    readonly RoundInfo: { [k: string]: ERound } = {};
    private CurRoundId: string;
    onAwake() {
        let domain = this.GetDomain<BaseNpc_Hero_Plus>();
        (this as any).PlayerID = domain.GetPlayerID();
        RoundSystem.RegComponent(this);
        this.initBasicRound();
    }

    private initBasicRound() {
        let keys = Object.keys(KVHelper.KvServerConfig.building_round);
        for (let configid of keys) {
            this.RoundInfo[configid] = this.AddChild(ERound, configid);
        }
    }

    runBasicRound(roundid: string) {
        let round = this.getCurrentBasicRound();
        round && round.OnEnd();
        let next = this.RoundInfo[roundid];
        this.CurRoundId = '' + roundid;
        next.OnStart();
    }

    private getCurrentBasicRound() {
        if (this.CurRoundId) {
            return this.RoundInfo[this.CurRoundId];
        }
    }

    private initChallengeRound() {
        let keys = Object.keys(KVHelper.KvServerConfig.building_round_challenge);
        for (let configid of keys) {
            this.RoundInfo[configid] = this.AddChild(ERound, configid);
        }
    }

    runChallengeRound(roundid: keyof building_round_challenge.OBJ_1_1) {
        if (this.RoundInfo[roundid] == null) {
            this.RoundInfo[roundid] = this.AddChild(ERoundChallenge, roundid);
        }
        this.RoundInfo[roundid].OnStart();
    }
}