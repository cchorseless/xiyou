import { reloadable } from "../../../GameCache";
import { GameSetting } from "../../../GameSetting";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET } from "../../Entity/Entity";
import { ChessControlConfig } from "../../System/ChessControl/ChessControlConfig";
import { RoundConfig } from "../../System/Round/RoundConfig";
import { BuildingEntityRoot } from "../Building/BuildingEntityRoot";
import { PlayerScene } from "../Player/PlayerScene";

@reloadable
export class ChessControlComponent extends ET.Component {

    OnRoundStartBattle() {

    }


    public moveChess(target: BuildingEntityRoot, v: Vector): [boolean, string] {
        let r: [boolean, string] = [true, ""];
        let playerRoot = this.Domain.ETRoot.AsPlayer();
        if (!playerRoot.CheckIsAlive()) {
            r = [false, "hero is death"];
        }
        if (target == null) {
            r = [false, "EntityRoot is null"];
        }
        if (playerRoot.GetDomainChild(target.Id) == null) {
            r = [false, "EntityRoot is not my"];
        }
        let ChessControlSystem = GameRules.Addon.ETRoot.ChessControlSystem();
        let boardVec = ChessControlSystem.GetBoardLocalVector2(v);
        if (boardVec.playerid != playerRoot.Playerid ||
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
            let curpos = target.GetDomain<BaseNpc_Plus>().GetAbsOrigin();
            oldNpc.ChessComp().blinkChessX(curpos);
        }
        target.ChessComp().blinkChessX(targetPos);
        return [true, ""];
    }

    public findEmptyStandbyChessVector() {
        let playerid = this.GetDomain<PlayerScene>().ETRoot.Playerid;
        let chessVector = new ChessControlConfig.ChessVector(0, 0, playerid);
        for (let i = 0; i < ChessControlConfig.Gird_Max_X; i++) {
            chessVector.x = i;
            if (GameRules.Addon.ETRoot.ChessControlSystem().IsBoardEmptyGird(chessVector)) {
                return chessVector;
            }
        }
        return null;
    }

}
