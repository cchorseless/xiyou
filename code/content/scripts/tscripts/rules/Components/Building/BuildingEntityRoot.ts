
import { GameFunc } from "../../../GameFunc";
import { KVHelper } from "../../../helper/KVHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_out_of_game } from "../../../npc/modifier/battle/modifier_out_of_game";
import { BattleUnitEntityRoot } from "../BattleUnit/BattleUnitEntityRoot";
import { CombinationComponent } from "../Combination/CombinationComponent";
import { BuildingDataComponent } from "./BuildingDataComponent";
import { BuildingRuntimeEntityRoot } from "./BuildingRuntimeEntityRoot";

export class BuildingEntityRoot extends BattleUnitEntityRoot {
    public onAwake(playerid: PlayerID, conf: string) {
        (this.BelongPlayerid as any) = playerid;
        (this.ConfigID as any) = conf;
        (this.EntityId as any) = this.GetDomain<IBaseNpc_Plus>().GetEntityIndex();
        this.AddComponent(GGetRegClass<typeof CombinationComponent>("CombinationComponent"));
        this.AddComponent(GGetRegClass<typeof BuildingDataComponent>("BuildingDataComponent"));
        this.addBattleComp();
        this.SyncClient();
    }
    IsBuilding() { return true }
    public RuntimeBuilding: BuildingRuntimeEntityRoot;
    public CreateCloneRuntimeBuilding() {
        if (!IsServer()) { return };
        let hCaster = this.GetDomain<IBaseNpc_Plus>();
        let vLocation = hCaster.GetAbsOrigin();
        let iTeamNumber = hCaster.GetTeamNumber()
        modifier_out_of_game.applyOnly(hCaster, hCaster);
        this.BuildingComp().SetUIOverHead(false)
        let hHero = PlayerResource.GetSelectedHeroEntity(hCaster.GetPlayerOwnerID())
        let cloneRuntime = BaseNpc_Plus.CreateUnitByName(this.ConfigID, vLocation, iTeamNumber, true, hHero, hHero) as IBaseNpc_Plus;
        if (cloneRuntime) {
            cloneRuntime.RemoveGesture(GameActivity_t.ACT_DOTA_SPAWN);
            BuildingRuntimeEntityRoot.Active(cloneRuntime, this.BelongPlayerid, this.ConfigID);
            let runtimeroot = cloneRuntime.ETRoot.As<BuildingRuntimeEntityRoot>();
            this.AddDomainChild(runtimeroot);
            this.RuntimeBuilding = runtimeroot;
            runtimeroot.BuildingComp().SetStar(this.BuildingComp().iStar);
            // wearable
            runtimeroot.WearableComp().WearCopy(this.WearableComp());
            // equip
            runtimeroot.InventoryComp().cloneItem(this.InventoryComp());
            // ability
            runtimeroot.AbilityManagerComp().cloneAbility(this.AbilityManagerComp());
            // buff
            runtimeroot.BuffManagerComp().cloneRuntimeBuff(this.BuffManagerComp())
        }
    }

    public RemoveCloneRuntimeBuilding() {
        if (this.RuntimeBuilding) {
            this.RuntimeBuilding.Dispose();
        }
        this.RuntimeBuilding = null;
        let hCaster = this.GetDomain<IBaseNpc_Plus>();
        this.BuildingComp().SetUIOverHead(true)
        hCaster.removeBuff<modifier_out_of_game>("modifier_out_of_game");
    }

    onDestroy(): void {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (GameFunc.IsValid(npc)) {
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

    BuildingComp() {
        return this.GetComponentByName<BuildingDataComponent>("BuildingDataComponent");
    }

}
declare global {
    type IBuildingEntityRoot = BuildingEntityRoot;
    var GBuildingEntityRoot: typeof BuildingEntityRoot;
}

if (_G.GBuildingEntityRoot == undefined) {
    _G.GBuildingEntityRoot = BuildingEntityRoot;
}