import { GameFunc } from "../../../GameFunc";
import { KVHelper } from "../../../helper/KVHelper";
import { BattleUnitEntityRoot } from "../BattleUnit/BattleUnitEntityRoot";

export class BattleUnitSummonEntityRoot extends BattleUnitEntityRoot {
    public onAwake(playerid: PlayerID, conf: string) {
        (this.BelongPlayerid as any) = playerid;
        (this.ConfigID as any) = conf;
        (this.EntityId as any) = this.GetDomain<IBaseNpc_Plus>().GetEntityIndex();
        this.addBattleComp();
        // this.SyncClientEntity(this);
    }

    IsSummon() {
        return true;
    }

    onDestroy(): void {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (GameFunc.IsValid(npc) && !npc.__safedestroyed__) {
            GDestroyUnit(npc);
        }
    }

    onKilled(events: EntityKilledEvent): void {
        super.onKilled(events);
    }

    Config() {
        return KVHelper.KvConfig().building_unit_tower["" + this.ConfigID];
    }

    GetDotaHeroName() {
        return this.Config().DotaHeroName;
    }

}
