import { LogHelper } from "../../../helper/LogHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ChessComponent } from "../ChessControl/ChessComponent";
import { PlayerCreateUnitEntityRoot } from "../Player/PlayerCreateUnitEntityRoot";
import { ERound } from "../Round/ERound";
import { ERoundBoard } from "../Round/ERoundBoard";
import { RoundEnemyComponent } from "../Round/RoundEnemyComponent";
import { EnemyKillPrizeComponent } from "./EnemyKillPrizeComponent";
import { EnemyMoveComponent } from "./EnemyMoveComponent";
import { EnemyPropsComponent } from "./EnemyPropsComponent";
import { EnemyUnitComponent } from "./EnemyUnitComponent";

export class EnemyUnitEntityRoot extends PlayerCreateUnitEntityRoot {
    readonly RoundID: string;
    readonly OnlyKey: string;

    SetConfigId(playerid: PlayerID, confid: string, roundid: string, onlyKey: string = null) {
        (this as any).Playerid = playerid;
        (this as any).ConfigID = confid;
        (this as any).RoundID = roundid;
        (this as any).OnlyKey = onlyKey;
    }


    GetRound<T extends ERound>(): T {
        return this.GetPlayer().RoundManagerComp().RoundInfo[this.RoundID] as T;
    }

    GetRoundUnitConfig() {
        if (this.OnlyKey != null) {
            return this.GetRound<ERoundBoard>().config.unitinfo[this.OnlyKey];
        }
    }



    EnemyUnitComp() {
        return this.GetComponentByName<EnemyUnitComponent>("EnemyUnitComponent");
    }

    EnemyKillPrize() {
        return this.GetComponentByName<EnemyKillPrizeComponent>("EnemyKillPrizeComponent");
    }
    EnemyMoveComp() {
        return this.GetComponentByName<EnemyMoveComponent>("EnemyMoveComponent");
    }
    EnemyPropsComp() {
        return this.GetComponentByName<EnemyPropsComponent>("EnemyPropsComponent");
    }
    ChessComp() {
        return this.GetComponentByName<ChessComponent>("ChessComponent");
    }
    RoundEnemyComp() {
        return this.GetComponentByName<RoundEnemyComponent>("RoundEnemyComponent");
    }
 
}
