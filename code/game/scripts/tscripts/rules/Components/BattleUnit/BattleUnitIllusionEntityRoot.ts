import { GameFunc } from "../../../GameFunc";
import { KVHelper } from "../../../helper/KVHelper";
import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { BuildingComponent } from "../Building/BuildingComponent";
import { BuildingPropsComponent } from "../Building/BuildingPropsComponent";
import { BattleUnitEntityRoot } from "../BattleUnit/BattleUnitEntityRoot";

export class BattleUnitIllusionEntityRoot extends BattleUnitEntityRoot {
    public onAwake(playerid: PlayerID, conf: string) {
        (this as any).Playerid = playerid;
        (this as any).ConfigID = conf;
        (this as any).EntityId = this.GetDomain<BaseNpc_Plus>().GetEntityIndex();
        this.addBattleComp();
        // this.SyncClientEntity(this);
    }

    IsIllusion(): boolean {
        return true;
    }

    onDestroy(): void {
        let npc = this.GetDomain<BaseNpc_Plus>();
        if (GameFunc.IsValid(npc) && !npc.__safedestroyed__) {
            npc.SafeDestroy();
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
