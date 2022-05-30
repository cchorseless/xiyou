import { GameSetting } from "../../../GameSetting";
import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET, registerET } from "../../Entity/Entity";
import { ChessControlConfig } from "../../System/ChessControl/ChessControlConfig";
import { BuildingEntityRoot } from "../Building/BuildingEntityRoot";

@registerET()
export class ChessControlComponent extends ET.Component {
    public moveChess(target: BuildingEntityRoot, v: Vector): [boolean, string] {
        let r: [boolean, string] = [true, ""];
        if (!this.Domain.ETRoot.AsPlayer().CheckIsAlive()) {
            r = [false, "hero is death"];
        }
        if (target == null) {
            r = [false, "EntityRoot is null"];
        }
        if (this.Domain.ETRoot!.GetDomainChild(target.Id) == null) {
            r = [false, "EntityRoot is not my"];
        }
        let ChessControlSystem = GameRules.Addon.ETRoot.ChessControlSystem();
        let boardVec = ChessControlSystem.GetBoardLocalVector2(v);
        if (boardVec.playerid != this.Domain.ETRoot.AsPlayer().Playerid ||
            boardVec.x < 0 || boardVec.y < 0 ||
            boardVec.y > ChessControlConfig.ChessValid_Max_Y) {
            r = [false, "not  vaild vector"];
        }
        if (target.ChessComp().ChessVector.isSame(boardVec)) {
            r = [false, "same vector"];
        }
        if (!r[0]) {
            EmitSoundOn("General.CastFail_NoMana", this.GetDomain<BaseNpc_Hero_Plus>());
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
}
