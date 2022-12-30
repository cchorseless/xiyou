
import { GameFunc } from "../../../GameFunc";
import { KVHelper } from "../../../helper/KVHelper";
import { building_auto_findtreasure } from "../../../npc/abilities/common/building_auto_findtreasure";
import { modifier_wait_portal } from "../../../npc/modifier/modifier_portal";
import { BattleUnitEntityRoot } from "../BattleUnit/BattleUnitEntityRoot";
import { BattleUnitManagerComponent } from "../BattleUnit/BattleUnitManagerComponent";
import { BuildingComponent } from "./BuildingComponent";

export class BuildingRuntimeEntityRoot extends BattleUnitEntityRoot {
    public IsRuntimeBuilding(): boolean {
        return true;
    }
    public onAwake(playerid: PlayerID, conf: string) {
        (this.BelongPlayerid as any) = playerid;
        (this.ConfigID as any) = conf;
        (this.EntityId as any) = this.GetDomain<IBaseNpc_Plus>().GetEntityIndex();
        this.AddComponent(GGetRegClass<typeof BattleUnitManagerComponent>("BattleUnitManagerComponent"));
        this.addBattleComp();
        this.AddComponent(GGetRegClass<typeof BuildingComponent>("BuildingComponent"));
        // this.SyncClientEntity(this);
    }
    onDestroy(): void {
        let npc = this.GetDomain<IBaseNpc_Plus>();
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

    GetSourceBuilding() {

    }

    StartFindTreasure() {
        let domain = this.GetDomain<IBaseNpc_Plus>();
        this.AbilityManagerComp().clearAllAbility();
        domain.addAbilityPlus("building_auto_findtreasure")
        building_auto_findtreasure.findIn(domain).StartFindTreasure();
        modifier_wait_portal.applyOnly(domain, domain, null, { duration: 60 });
    }

    StopFindTreasure() {
        let domain = this.GetDomain<IBaseNpc_Plus>();
        let ability = building_auto_findtreasure.findIn(domain);
        if (ability.IsFinding()) {
            ability.GoBackBoard();
        }
    }
    OnBackBoardFromBaseRoom() {
        let domain = this.GetDomain<IBaseNpc_Plus>();
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