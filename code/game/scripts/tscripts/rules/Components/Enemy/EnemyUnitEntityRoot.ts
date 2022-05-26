import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET } from "../../Entity/Entity";
import { PlayerSystem } from "../../System/Player/PlayerSystem";
import { ERound } from "../Round/ERound";
import { EnemyKillPrizeComponent } from "./EnemyKillPrizeComponent";
import { EnemyMoveComponent } from "./EnemyMoveComponent";
import { EnemyPropsComponent } from "./EnemyPropsComponent";
import { EnemyUnitComponent } from "./EnemyUnitComponent";

export class EnemyUnitEntityRoot extends ET.EntityRoot {
    readonly Playerid: PlayerID;
    readonly ConfigID: string;
    readonly RoundID: string;

    SetConfigId(playerid: PlayerID, confid: string, roundid: string) {
        (this as any).Playerid = playerid;
        (this as any).ConfigID = confid;
        (this as any).RoundID = roundid;
    }

    GetPlayer() {
        return PlayerSystem.GetPlayer(this.Playerid);
    }

    GetRound(): ERound {
        return this.GetPlayer().RoundManagerComp().RoundInfo[this.RoundID];
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

    public Dispose(): void {
        let npc = this.GetDomain<BaseNpc_Plus>();
        super.Dispose();
        npc.SafeDestroy();
    }
}
