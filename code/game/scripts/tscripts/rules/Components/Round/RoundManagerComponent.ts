import { reloadable } from "../../../GameCache";
import { EventHelper } from "../../../helper/EventHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { ET, serializeETProps } from "../../Entity/Entity";
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
        this.Domain.ETRoot.AsPlayer().SyncClientEntity(this, true);
    }
    @serializeETProps()
    curRoundBoard: string;

    private initChallengeRound() {
        for (let k in KVHelper.KvServerConfig.building_round_board_challenge) {
            if (KVHelper.KvServerConfig.building_round_board_challenge[k].round_label == GameRules.Addon.ETRoot.GameStateSystem().DifficultyChapter) {
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
        (this.RoundInfo[roundid] as ERoundBoard).OnStart();
        this.Domain.ETRoot.AsPlayer().SyncClientEntity(this, true);
    }

    public getCurrentBoardRound() {
        return this.RoundInfo[this.curRoundBoard] as ERoundBoard;
    }

    public getBoardChallengeRound(id: string) {
        return this.RoundInfo[id] as ERoundBoardChallenge;
    }
}
