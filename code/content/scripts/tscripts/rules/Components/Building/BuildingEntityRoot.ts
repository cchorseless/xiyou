
import { KVHelper } from "../../../helper/KVHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_mana_control } from "../../../npc/modifier/battle/modifier_mana_control";
import { modifier_never_death } from "../../../npc/modifier/battle/modifier_never_death";
import { modifier_out_of_game } from "../../../npc/modifier/battle/modifier_out_of_game";
import { BuildingConfig } from "../../../shared/BuildingConfig";
import { BattleUnitEntityRoot } from "../BattleUnit/BattleUnitEntityRoot";
import { CombinationComponent } from "../Combination/CombinationComponent";
import { BuildingRuntimeEntityRoot } from "./BuildingRuntimeEntityRoot";

export class BuildingEntityRoot extends BattleUnitEntityRoot {
    private iGoldCost: number;
    /**累计造成伤害 */
    public fDamage: number;
    public onAwake(playerid: PlayerID, conf: string) {
        (this.BelongPlayerid as any) = playerid;
        (this.ConfigID as any) = conf;
        (this.EntityId as any) = this.GetDomain<IBaseNpc_Plus>().GetEntityIndex();
        this.AddComponent(GGetRegClass<typeof CombinationComponent>("CombinationComponent"));
        this.addBattleComp();
        this.onInit()
    }
    /**金币价格 */
    GetGoldCost() {
        return this.iGoldCost || 0;
    }

    GetPopulation(): number {
        return GBuildingSystem.GetInstance().GetBuildingPopulation(this.ConfigID)
    }
    /**
     * 升星
     * @param n
     */
    AddStar(n: number) {
        this.iStar += n;
        let domain = this.GetDomain<IBaseNpc_Plus>();
        let levelupconfig = GJSONConfig.BuildingLevelUpConfig.get(domain.GetUnitName());
        if (levelupconfig) {
            let levelup = levelupconfig.LevelUpInfo.find(v => v.Level == this.iStar);
            if (levelup) {
                if (levelup.AttachWearables.length > 0) {
                    levelup.AttachWearables.forEach(v => {
                        this.WearableComp().Wear(v, "levelup");
                    })
                }
            }
        }

        // "particles/generic_hero_status/hero_levelup.vpcf"
        // "particles/units/heroes/hero_oracle/oracle_false_promise_cast_enemy.vpcf"
        let iParticleID = ResHelper.CreateParticle(
            new ResHelper.ParticleInfo()
                .set_resPath("particles/generic_hero_status/hero_levelup.vpcf")
                .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                .set_owner(domain)
                .set_validtime(3)
        );
        EmitSoundOn("lvl_up", domain);
        // 变大
        domain.SetModelScale(this.iScale * BuildingConfig.MODEL_SCALE[this.iStar - 1]);
        // 技能升级
        this.AbilityManagerComp().levelUpAllAbility();
        // 通知跑马灯
        this.SyncClient();
    }

    IsBuilding() { return true }
    public RuntimeBuilding: BuildingRuntimeEntityRoot;
    public CreateCloneRuntimeBuilding() {
        if (!IsServer()) { return };
        let hCaster = this.GetDomain<IBaseNpc_Plus>();
        let vLocation = hCaster.GetAbsOrigin();
        modifier_out_of_game.applyOnly(hCaster, hCaster);
        this.SetUIOverHead(false, true)
        let cloneRuntime = BaseNpc_Plus.CreateUnitByName(this.ConfigID, vLocation, hCaster) as IBaseNpc_Plus;
        if (cloneRuntime) {
            // cloneRuntime.RemoveGesture(GameActivity_t.ACT_DOTA_SPAWN);
            cloneRuntime.StartGestureFadeWithSequenceSettings(GameActivity_t.ACT_DOTA_TAUNT);
            BuildingRuntimeEntityRoot.Active(cloneRuntime, this.BelongPlayerid, this.ConfigID);
            let runtimeroot = cloneRuntime.ETRoot.As<BuildingRuntimeEntityRoot>();
            this.AddDomainChild(runtimeroot);
            this.RuntimeBuilding = runtimeroot;
            runtimeroot.SetStar(this.iStar);
            // wearable
            runtimeroot.WearableComp().WearCopy(this.WearableComp());
            // equip
            runtimeroot.InventoryComp().cloneItem(this.InventoryComp());
            // ability
            runtimeroot.AbilityManagerComp().cloneAbility(this.AbilityManagerComp());
            // buff
            runtimeroot.BuffManagerComp().cloneRuntimeBuff(this.BuffManagerComp())
            runtimeroot.SyncClient();
            // 不死
            modifier_never_death.applyOnly(cloneRuntime, cloneRuntime);
            // 回蓝
            modifier_mana_control.applyOnly(cloneRuntime, cloneRuntime);
        }
    }

    public RemoveCloneRuntimeBuilding() {
        if (this.RuntimeBuilding) {
            this.RuntimeBuilding.Dispose();
        }
        this.RuntimeBuilding = null;
        let hCaster = this.GetDomain<IBaseNpc_Plus>();
        this.SetUIOverHead(true, false)
        hCaster.removeBuff<modifier_out_of_game>("modifier_out_of_game");
    }

    onDestroy(): void {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (GFuncEntity.IsValid(npc)) {
            GFuncEntity.SafeDestroyUnit(npc);
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
declare global {
    type IBuildingEntityRoot = BuildingEntityRoot;
    var GBuildingEntityRoot: typeof BuildingEntityRoot;
}

if (_G.GBuildingEntityRoot == undefined) {
    _G.GBuildingEntityRoot = BuildingEntityRoot;
}