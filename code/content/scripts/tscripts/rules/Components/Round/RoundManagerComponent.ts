
import { RoundConfig } from "../../../shared/RoundConfig";
import { ET, serializeETProps } from "../../../shared/lib/Entity";
import { ERound } from "./ERound";
import { ERoundBoard } from "./ERoundBoard";
import { ERoundBoardChallenge } from "./ERoundBoardChallenge";

@GReloadable
export class RoundManagerComponent extends ET.Component {
    readonly RoundInfo: { [k: string]: ERound } = {};
    onAwake() {
        this.initBoardRound();
        this.initChallengeRound();
        this.SyncClient(true);
    }
    @serializeETProps()
    curRoundBoard: string;

    private initChallengeRound() {
        let data = GJSONConfig.RoundBoardChallengeConfig.getDataList();
        for (let info of data) {
            if (info.roundLabel == GGameServiceSystem.GetInstance().getDifficultyChapterDes()) {
                this.RoundInfo[info.id] = this.AddChild(ERoundBoardChallenge, info.id);
            }
        }
    }

    runChallengeRound(roundid: string) {
        if (this.RoundInfo[roundid] == null) {
            this.RoundInfo[roundid] = this.AddChild(ERoundBoardChallenge, roundid);
        }
        this.RoundInfo[roundid].OnRound_Start();
    }

    private initBoardRound() {
        let data = GJSONConfig.RoundBoardChallengeConfig.getDataList();
        for (let info of data) {
            this.RoundInfo[info.id] = this.AddChild(ERoundBoard, info.id);
        }
    }
    public runBoardRound(roundid: string) {
        if (this.RoundInfo[roundid] == null) {
            this.RoundInfo[roundid] = this.AddChild(ERoundBoard, roundid);
        }
        this.curRoundBoard = roundid as string;
        (this.RoundInfo[roundid] as ERoundBoard).OnRound_Start();
        this.SyncClient(true);
    }
    /**
     * 暂停回合
     * @param isPaused 
     */
    public debugPauseBoardRound(isPaused: boolean) {
        (this.RoundInfo[this.curRoundBoard] as ERoundBoard)._debug_StageStopped = isPaused;
    }

    public debugNextBoardRound() {
        (this.RoundInfo[this.curRoundBoard] as ERoundBoard)._debug_nextStage();
    }
    public getCurrentBoardRound() {
        return this.RoundInfo[this.curRoundBoard] as ERoundBoard;
    }

    public getBoardChallengeRound(challengetype: RoundConfig.EERoundType) {
        let configid = GGameServiceSystem.GetInstance().getDifficultyChapterDes() + challengetype;
        return this.RoundInfo[configid] as ERoundBoardChallenge;
    }

    OnGame_End(iswin: boolean) {
        // this.debugPauseBoardRound(true)
    }
}
