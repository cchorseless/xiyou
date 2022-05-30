import { LogHelper } from "../../../helper/LogHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ChessComponent } from "../ChessControl/ChessComponent";
import { PlayerCreateUnitEntityRoot } from "../Player/PlayerCreateUnitEntityRoot";
import { ERound } from "../Round/ERound";



export class RoundPrizeUnitEntityRoot extends PlayerCreateUnitEntityRoot {
    readonly RoundID: string;
    readonly OnlyKey: string;

    SetConfigId(playerid: PlayerID, confid: string, roundid: string, onlyKey: string = null) {
        (this as any).Playerid = playerid;
        (this as any).ConfigID = confid;
        (this as any).RoundID = roundid;
        (this as any).OnlyKey = onlyKey;
    }

    EnemyKillPrize() {
        // return this.GetComponentByName<EnemyKillPrizeComponent>("EnemyKillPrizeComponent");
    }
 
}
