import { EventHelper } from "../../../helper/EventHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { building_round_board } from "../../../kvInterface/building/building_round_board";
import { building_round_challenge } from "../../../kvInterface/building/building_round_challenge";
import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { ET, registerET, serializeETProps } from "../../Entity/Entity";
import { RoundState } from "../../System/Round/RoundState";
import { ERound } from "./ERound";
import { ERoundBoard } from "./ERoundBoard";
import { ERoundChallenge } from "./ERoundChallenge";

@registerET()
export class RoundManagerComponent extends ET.Component {
    readonly RoundInfo: { [k: string]: ERound } = {};
    onAwake() {
        this.initBoardRound();
    }
    @serializeETProps()
    curRoundBoard: string;
    // private initBasicRound() {
    //     let keys = Object.keys(KVHelper.KvServerConfig.building_round);
    //     for (let configid of keys) {
    //         this.RoundInfo[configid] = this.AddChild(ERound, configid);
    //     }
    // }

    // runBasicRound(roundid: string) {
    //     let round = this.getCurrentBasicRound();
    //     round && round.OnEnd();
    //     let next = this.RoundInfo[roundid];
    //     this.CurRoundId = "" + roundid;
    //     next.OnStart();
    // }

    // private getCurrentBasicRound() {
    //     if (this.CurRoundId) {
    //         return this.RoundInfo[this.CurRoundId];
    //     }
    // }

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

    private initBoardRound() {
        let keys = Object.keys(KVHelper.KvServerConfig.building_round_board);
        for (let configid of keys) {
            this.RoundInfo[configid] = this.AddChild(ERoundBoard, configid);
        }
    }
    public runBoardRound(roundid: keyof building_round_board.OBJ_1_1) {
        if (this.RoundInfo[roundid] == null) {
            this.RoundInfo[roundid] = this.AddChild(ERoundBoard, roundid);
        }
        this.curRoundBoard = roundid as string;
        (this.RoundInfo[roundid] as ERoundBoard).OnStart();
        let playerid = this.Domain.ETRoot.AsPlayer().Playerid;
        EventHelper.SyncETEntity(this.toJsonObject(true), playerid);
        EventHelper.SyncETEntity(this.RoundInfo[roundid].toJsonObject(), playerid);
    }
    public getCurrentBoardRound() {
        return this.RoundInfo[this.curRoundBoard] as ERoundBoard;
    }
}
