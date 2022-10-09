import { KVHelper } from "../../../helper/KVHelper";
import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { BuildingComponent } from "../Building/BuildingComponent";
import { BuildingPropsComponent } from "../Building/BuildingPropsComponent";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";

export class BattleUnitIllusionEntityRoot extends PlayerCreateBattleUnitEntityRoot {
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
        if (npc && !npc.__safedestroyed__) {
            npc.StartGesture(GameActivity_t.ACT_DOTA_DIE);
            TimerHelper.addTimer(
                3,
                () => {
                    npc.SafeDestroy();
                },
                this
            );
        }
    }

    onKilled(events: EntityKilledEvent): void {
        let npc = this.GetDomain<BaseNpc_Plus>();
        npc.StartGesture(GameActivity_t.ACT_DOTA_DIE);
    }

    Config() {
        return KVHelper.KvConfig().building_unit_tower["" + this.ConfigID];
    }

    GetDotaHeroName() {
        return this.Config().DotaHeroName;
    }
}
