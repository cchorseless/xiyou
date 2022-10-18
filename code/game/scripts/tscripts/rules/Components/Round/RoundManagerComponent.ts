import { reloadable } from "../../../GameCache";
import { EventHelper } from "../../../helper/EventHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { building_round_board } from "../../../kvInterface/building/building_round_board";
import { building_round_board_challenge } from "../../../kvInterface/building/building_round_board_challenge";
import { ET, serializeETProps } from "../../Entity/Entity";
import { DifficultyState } from "../../System/Difficulty/DifficultyState";
import { RoundState } from "../../System/Round/RoundState";
import { ERound } from "./ERound";
import { ERoundBoard } from "./ERoundBoard";
import { ERoundBoardChallenge } from "./ERoundBoardChallenge";

@reloadable
export class RoundManagerComponent extends ET.Component {
    readonly RoundInfo: { [k: string]: ERound } = {};
    onAwake() {
        this.initBoardRound();
        this.initChallengeRound();
    }
    @serializeETProps()
    curRoundBoard: string;

    private initChallengeRound() {
        for (let k in KVHelper.KvServerConfig.building_round_board_challenge) {
            if (KVHelper.KvServerConfig.building_round_board_challenge[k].round_label == DifficultyState.DifficultyChapter) {
                this.RoundInfo[k] = this.AddChild(ERoundBoardChallenge, k);
            }
        }
    }

    runChallengeRound(roundid: keyof building_round_board_challenge.OBJ_1_1) {
        if (this.RoundInfo[roundid] == null) {
            this.RoundInfo[roundid] = this.AddChild(ERoundBoardChallenge, roundid);
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
        this.Domain.ETRoot.AsPlayer().SyncClientEntity(this, true);
        (this.RoundInfo[roundid] as ERoundBoard).OnStart();
    }
    public getCurrentBoardRound() {
        return this.RoundInfo[this.curRoundBoard] as ERoundBoard;
    }

    public getBoardChallengeRound(id: string) {
        return this.RoundInfo[id] as ERoundBoardChallenge;
    }
}
