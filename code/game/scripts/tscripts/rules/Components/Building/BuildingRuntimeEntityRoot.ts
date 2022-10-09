import { KVHelper } from "../../../helper/KVHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { building_auto_findtreasure } from "../../../npc/abilities/common/building_auto_findtreasure";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_wait_portal } from "../../../npc/modifier/modifier_portal";
import { BattleUnitManagerComponent } from "../BattleUnit/BattleUnitManagerComponent";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";
import { BuildingComponent } from "./BuildingComponent";

export class BuildingRuntimeEntityRoot extends PlayerCreateBattleUnitEntityRoot {
    public IsRuntimeBuilding(): boolean {
        return true;
    }
    public onAwake(playerid: PlayerID, conf: string) {
        (this as any).Playerid = playerid;
        (this as any).ConfigID = conf;
        (this as any).EntityId = this.GetDomain<BaseNpc_Plus>().GetEntityIndex();
        this.AddComponent(PrecacheHelper.GetRegClass<typeof BattleUnitManagerComponent>("BattleUnitManagerComponent"));
        this.addBattleComp();
        this.AddComponent(PrecacheHelper.GetRegClass<typeof BuildingComponent>("BuildingComponent"));
        this.SyncClientEntity(this);
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

    GetSourceBuilding() {

    }

    StartFindTreasure() {
        let domain = this.GetDomain<BaseNpc_Plus>();
        this.AbilityManagerComp().clearAllAbility();
        this.AbilityManagerComp().learnAbility("building_auto_findtreasure");
        building_auto_findtreasure.findIn(domain).StartFindTreasure();
        modifier_wait_portal.applyOnly(domain, domain, null, { duration: 60 });
    }

    StopFindTreasure() {
        let domain = this.GetDomain<BaseNpc_Plus>();
        let ability = building_auto_findtreasure.findIn(domain);
        if (ability.IsFinding()) {
            ability.GoBackBoard();
        }
    }
    OnBackBoardFromBaseRoom() {
        let domain = this.GetDomain<BaseNpc_Plus>();
        domain.SetIdleAcquire(true);
        // domain.StartGesture(GameActivity_t.ACT_DOTA_IDLE);
    }
    GetDotaHeroName() {
        return this.Config().DotaHeroName;
    }
    BattleUnitManager() {
        return this.GetComponentByName<BattleUnitManagerComponent>("BattleUnitManagerComponent");
    }
    BuildingComp() {
        return this.GetComponentByName<BuildingComponent>("BuildingComponent");
    }


}