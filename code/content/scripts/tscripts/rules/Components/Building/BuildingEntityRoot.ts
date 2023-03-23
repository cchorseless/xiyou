
import { KVHelper } from "../../../helper/KVHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_jiaoxie_wudi } from "../../../npc/modifier/battle/modifier_jiaoxie_wudi";
import { modifier_mana_control } from "../../../npc/modifier/battle/modifier_mana_control";
import { modifier_out_of_game } from "../../../npc/modifier/battle/modifier_out_of_game";
import { BuildingConfig } from "../../../shared/BuildingConfig";
import { GEventHelper } from "../../../shared/lib/GEventHelper";
import { THeroUnit } from "../../../shared/service/hero/THeroUnit";
import { BattleUnitEntityRoot } from "../BattleUnit/BattleUnitEntityRoot";
import { CombinationComponent } from "../Combination/CombinationComponent";
import { ERoundBoard } from "../Round/ERoundBoard";
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
        let herounit = GTCharacter.GetOneInstance(this.BelongPlayerid).HeroManageComp.GetHeroUnit(conf);
        this.LoadServerData(herounit, true);
        GEventHelper.AddEvent(THeroUnit.updateEventClassName(), GHandler.create(this, (_hero: THeroUnit) => {
            this.LoadServerData(_hero);
        }), this.BelongPlayerid);
        this.InitSyncClientInfo();
        this.JoinInRound();
    }

    LoadServerData(herounit: THeroUnit, isinit = false) {
        if (!herounit || herounit.IsDisposed()) { return }
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (herounit.BindHeroName() != npc.GetUnitName()) { return }
        // 设置等级
        if (herounit && herounit.Level > npc.GetLevel()) {
            let iLevel = herounit.Level - npc.GetLevel();
            npc.CreatureLevelUp(iLevel);
            if (!isinit) {
                for (let i = 0; i < iLevel; i++) {
                    GTimerHelper.AddTimer(0.5 * i, GHandler.create(this, () => {
                        ResHelper.CreateParticle(
                            new ResHelper.ParticleInfo()
                                .set_resPath("particles/generic_hero_status/hero_levelup.vpcf")
                                .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                                .set_owner(npc)
                                .set_validtime(3)
                        );
                        EmitSoundOn("lvl_up", npc);
                    }));
                }
            }
        }
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
            let levelup = levelupconfig.StarUpInfo.find(v => v.Star == this.iStar);
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
    /**助战玩家ID */
    HelperPlayerid: PlayerID;

    public RuntimeBuilding: BuildingRuntimeEntityRoot;
    OnRound_Start() {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        modifier_jiaoxie_wudi.applyOnly(npc, npc);
        if (this.RuntimeBuilding) {
            this.RuntimeBuilding.Dispose();
        }
        this.RuntimeBuilding = null;
        this.SetUIOverHead(true, false)
        npc.removeBuff<modifier_out_of_game>("modifier_out_of_game");
    }
    OnRound_Battle() {
        if (!IsServer()) { return };
        if (!this.ChessComp().isInBattle) { return }
        let hCaster = this.GetDomain<IBaseNpc_Plus>();
        let vLocation = hCaster.GetAbsOrigin();
        modifier_out_of_game.applyOnly(hCaster, hCaster);
        this.SetUIOverHead(false, true)
        let cloneRuntime = BaseNpc_Plus.CreateUnitByName(this.ConfigID, vLocation, hCaster) as IBaseNpc_Plus;
        if (cloneRuntime) {
            // cloneRuntime.RemoveGesture(GameActivity_t.ACT_DOTA_SPAWN);
            // 可能助战情况下，助战玩家ID不是自己
            let playerid = this.HelperPlayerid || this.BelongPlayerid;
            cloneRuntime.StartGestureFadeWithSequenceSettings(GameActivity_t.ACT_DOTA_TAUNT);
            BuildingRuntimeEntityRoot.Active(cloneRuntime, playerid, this.ConfigID);
            let runtimeroot = cloneRuntime.ETRoot.As<BuildingRuntimeEntityRoot>();
            GGameScene.GetPlayer(playerid).AddDomainChild(runtimeroot);
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
            // modifier_never_death.applyOnly(cloneRuntime, cloneRuntime);
            // 回蓝
            modifier_mana_control.applyOnly(cloneRuntime, cloneRuntime);
        }
    }
    OnRound_Prize(round: ERoundBoard) { }
    OnRound_WaitingEnd() { }

    onDestroy(): void {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (GFuncEntity.IsValid(npc)) {
            GFuncEntity.SafeDestroyUnit(npc);
        }
        // npc.HasScepter
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