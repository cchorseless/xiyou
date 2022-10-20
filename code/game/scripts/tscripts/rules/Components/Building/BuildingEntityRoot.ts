import { GetRegClass } from "../../../GameCache";
import { GameFunc } from "../../../GameFunc";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
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
        let buff = modifier_out_of_game.applyOnly(hCaster,hCaster);
        LogHelper.print(buff==null)
        this.SetUIOverHead(false)
        let hHero = PlayerResource.GetSelectedHeroEntity(hCaster.GetPlayerOwnerID())
        let cloneRuntime = CreateUnitByName(this.ConfigID, vLocation, true, hHero, hHero, iTeamNumber) as BaseNpc_Plus;
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
            let allItem = this.ItemManagerComp().getAllBaseItem();
            allItem.forEach(item => {
                let hItem = ActiveRootItem.CreateOneToUnit(cloneRuntime, item.GetAbilityName());
                if (item.IsStackable()) {
                    hItem.SetCurrentCharges(item.GetCurrentCharges())
                }
            });
            // ability
            let allability = this.AbilityManagerComp().getAllBaseAbility();
            allability.forEach(ability => {
                let abilityname = ability.GetAbilityName();
                if (cloneRuntime.FindAbilityByName(abilityname) == null) {
                    cloneRuntime.addAbilityPlus(abilityname)
                }
            })
            // buff
            let modifiers = hCaster.FindAllModifiers() as BaseModifier_Plus[];
            for (let modifier of (modifiers)) {

                if (modifier.GetName() == "modifier_jiaoxie_wudi") {
                    continue;
                }
                if (modifier.GetName() == "modifier_out_of_game") {
                    continue;
                }
                let buff = cloneRuntime.addBuff(modifier.GetName(), modifier.GetCasterPlus(), modifier.GetAbilityPlus())
                buff.SetStackCount(modifier.GetStackCount())
            }
        }
    }

    public RemoveCloneRuntimeBuilding() {
        if (this.RuntimeBuilding) {
            this.RuntimeBuilding.Dispose();
        }
        this.RuntimeBuilding = null;
        let hCaster = this.GetDomain<BaseNpc_Plus>();
        // hCaster.RemoveNoDraw();
        hCaster.removeBuff<modifier_out_of_game>("modifier_out_of_game");
        this.SetUIOverHead(true)
    }

    onDestroy(): void {
        let npc = this.GetDomain<BaseNpc_Plus>();
        if (GameFunc.IsValid(npc) && !npc.__safedestroyed__) {
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

    BuildingComp() {
        return this.GetComponentByName<BuildingComponent>("BuildingComponent");
    }

}
