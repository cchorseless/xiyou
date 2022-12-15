import { GetRegClass } from "../../../GameCache";
import { GameFunc } from "../../../GameFunc";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseModifier_Plus } from "../../../npc/entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ActiveRootItem } from "../../../npc/items/ActiveRootItem";
import { modifier_out_of_game } from "../../../npc/modifier/battle/modifier_out_of_game";
import { CombinationComponent } from "../Combination/CombinationComponent";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";
import { BuildingComponent } from "./BuildingComponent";
import { BuildingRuntimeEntityRoot } from "./BuildingRuntimeEntityRoot";

export class BuildingEntityRoot extends PlayerCreateBattleUnitEntityRoot {
    public onAwake(playerid: PlayerID, conf: string) {
        (this as any).Playerid = playerid;
        (this as any).ConfigID = conf;
        (this as any).EntityId = this.GetDomain<BaseNpc_Plus>().GetEntityIndex();
        this.AddComponent(GetRegClass<typeof CombinationComponent>("CombinationComponent"));
        this.AddComponent(GetRegClass<typeof BuildingComponent>("BuildingComponent"));
        this.addBattleComp();
        this.SyncClientEntity(this);
    }
    IsBuilding() { return true }
    public RuntimeBuilding: BuildingRuntimeEntityRoot;
    public CreateCloneRuntimeBuilding() {
        if (!IsServer()) { return };
        let hCaster = this.GetDomain<BaseNpc_Plus>();
        let vLocation = hCaster.GetAbsOrigin();
        let iTeamNumber = hCaster.GetTeamNumber()
        // hCaster.AddNoDraw();
        modifier_out_of_game.applyOnly(hCaster, hCaster);
        this.BuildingComp().SetUIOverHead(false)
        let hHero = PlayerResource.GetSelectedHeroEntity(hCaster.GetPlayerOwnerID())
        let cloneRuntime = BaseNpc_Plus.CreateUnitByName(this.ConfigID, vLocation, iTeamNumber, true, hHero, hHero) as BaseNpc_Plus;
        if (cloneRuntime) {
            cloneRuntime.RemoveGesture(GameActivity_t.ACT_DOTA_SPAWN);
            BuildingRuntimeEntityRoot.Active(cloneRuntime, this.Playerid, this.ConfigID);
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
        let hCaster = this.GetDomain<BaseNpc_Plus>();
        // hCaster.RemoveNoDraw();
        this.BuildingComp().SetUIOverHead(true)
        hCaster.removeBuff<modifier_out_of_game>("modifier_out_of_game");
    }

    onDestroy(): void {
        let npc = this.GetDomain<BaseNpc_Plus>();
        if (GameFunc.IsValid(npc)) {
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

    BuildingComp() {
        return this.GetComponentByName<BuildingComponent>("BuildingComponent");
    }

}
