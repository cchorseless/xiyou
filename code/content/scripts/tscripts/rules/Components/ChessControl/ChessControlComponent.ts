
import { ChessControlConfig } from "../../../shared/ChessControlConfig";
import { ET } from "../../../shared/lib/Entity";
import { RoundConfig } from "../../../shared/RoundConfig";
import { PlayerScene } from "../Player/PlayerScene";
import { ChessVector } from "./ChessVector";

@GReloadable
export class ChessControlComponent extends ET.Component {

    OnRoundStartBattle() {
    }

    public moveChess(target: IBuildingEntityRoot, v: Vector): [boolean, string] {
        let r: [boolean, string] = [true, ""];
        let playerRoot = GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid);
        if (!playerRoot.CheckIsAlive()) {
            r = [false, "hero is death"];
        }
        if (target == null) {
            r = [false, "EntityRoot is null"];
        }
        if (playerRoot.GetDomainChild(target.Id) == null) {
            r = [false, "EntityRoot is not my"];
        }
        let ChessControlSystem = GChessControlSystem.GetInstance();
        let boardVec = ChessControlSystem.GetBoardLocalVector2(v);
        if (boardVec.playerid != playerRoot.BelongPlayerid ||
            boardVec.x < 0 || boardVec.y < 0 ||
            boardVec.y > ChessControlConfig.ChessValid_Max_Y) {
            r = [false, "not  vaild vector"];
        }
        let currentround = playerRoot.RoundManagerComp().getCurrentBoardRound();
        if (currentround.roundState != RoundConfig.ERoundBoardState.start
            && !boardVec.isY(0)
        ) {
            r = [false, "move chess only in round start"];
        }
        if (target.ChessComp().ChessVector.isSame(boardVec)) {
            r = [false, "same vector"];
        }
        if (!r[0]) {
            EmitSoundOn("General.CastFail_NoMana", this.GetDomain<PlayerScene>().ETRoot.Hero);
            return r;
        }
        let targetPos = ChessControlSystem.GetBoardGirdCenterVector3(boardVec);
        let oldNpcarr = ChessControlSystem.FindBoardInGirdChess(boardVec);
        // 交换位置
        if (oldNpcarr.length > 0) {
            let oldNpc = oldNpcarr[0];
            let curpos = target.GetDomain<IBaseNpc_Plus>().GetAbsOrigin();
            oldNpc.ChessComp().blinkChessX(curpos);
        }
        target.ChessComp().blinkChessX(targetPos);
        return [true, ""];
    }

    public findEmptyStandbyChessVector() {
        let playerid = this.GetDomain<PlayerScene>().ETRoot.BelongPlayerid;
        let chessVector = new ChessVector(0, 0, playerid);
        for (let i = 0; i < ChessControlConfig.Gird_Max_X; i++) {
            chessVector.x = i;
            if (GChessControlSystem.GetInstance().IsBoardEmptyGird(chessVector)) {
                return chessVector;
            }
        }
        return null;
    }

}
