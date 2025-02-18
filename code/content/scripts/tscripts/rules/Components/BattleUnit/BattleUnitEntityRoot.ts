
import { ResHelper } from "../../../helper/ResHelper";
import { modifier_no_health_bar } from "../../../npc/modifier/modifier_no_health_bar";
import { modifier_hero_property } from "../../../npc/propertystat/modifier_hero_property";
import { BuildingConfig } from "../../../shared/BuildingConfig";
import { serializeETProps } from "../../../shared/lib/Entity";
import { RoundConfig } from "../../../shared/RoundConfig";
import { BaseEntityRoot } from "../../Entity/BaseEntityRoot";
import { AbilityManagerComponent } from "../Ability/AbilityManagerComponent";
import { AiAttackComponent } from "../AI/AiAttackComponent";
import { BuffManagerComponent } from "../Buff/BuffManagerComponent";
import { ChessMoveComponent } from "../ChessControl/ChessMoveComponent";
import { CombinationComponent } from "../Combination/CombinationComponent";
import { InventoryComponent } from "../Inventory/InventoryComponent";
import { ERoundBoard } from "../Round/ERoundBoard";
import { WearableComponent } from "../Wearable/WearableComponent";

export class BattleUnitEntityRoot extends BaseEntityRoot implements IRoundStateCallback {
    public iScale: number;
    @serializeETProps()
    public iStar: number = 1;
    @serializeETProps()
    public IsShowOverhead: boolean = false;

    readonly isAlive: boolean = true;
    JoinInRound(): void {
        let domain = this.GetDomain<IBaseNpc_Plus>();
        let currentround = domain.ETRoot.As<IBattleUnitEntityRoot>().GetPlayer().RoundManagerComp().getCurrentBoardRound();
        switch (currentround.roundState) {
            case RoundConfig.ERoundBoardState.start:
                this.OnRound_Start(currentround);
                break;
            case RoundConfig.ERoundBoardState.battle:
                this.OnRound_Battle(currentround);
                break;
            case RoundConfig.ERoundBoardState.prize:
                this.OnRound_Prize(currentround);
                break;
            case RoundConfig.ERoundBoardState.waiting_next:
                this.OnRound_WaitingEnd();
                break;
        }
    }
    InitColor() {
        if (!this.IsFriendly()) { return }
        let npc = this.GetDomain<IBaseNpc_Plus>();
        let vColor = this.GetPlayer().GetColor();
        // npc.SetRenderColor(vColor.x, vColor.y, vColor.z);
        // let info: ResHelper.IParticleInfo = {
        //     resPath: "particles/items2_fx/teleport_start_playercolor.vpcf",
        //     iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
        //     owner: npc,
        // };
        // PlayerResource.GetLocalOrigin
        // let iParticleID = ResHelper.CreateParticle(info);
        // ParticleManager.SetParticleControl(iParticleID, 2, vColor);
    }
    InitSyncClientInfo() {
        let domain = this.GetDomain<IBaseNpc_Plus>();
        if (!domain.IsAttacker()) {
            return;
        }
        modifier_hero_property.applyOnly(domain, domain);
        // m.StackCountHandler = GHandler.create(this, (attr: Attributes) => {
        //     this.PrimaryAttribute = attr;
        //     this.SyncClient(true);
        // }, null, false);
    }

    SetUIOverHead(isshowCustom: boolean, isshowdota: boolean) {
        this.IsShowOverhead = isshowCustom;
        let domain = this.GetDomain<IBaseNpc_Plus>();
        if (isshowdota) {
            modifier_no_health_bar.remove(domain);
        }
        else {
            modifier_no_health_bar.applyOnly(domain, domain);
        }
        this.SyncClient(true);
    }
    GetRoundHeroDamage() {
        return this.iStar;
    }
    /**是否可以升星 */
    checkCanStarUp() {
        return this.iStar < BuildingConfig.MAX_STAR;
    }
    changeAliveState(state: boolean) {
        (this.isAlive as any) = state;
    }
    CloneSelf(vLocation: Vector, fDuration: number) {
        let domain = this.GetDomain<IBaseNpc_Plus>();
        let cloneRuntime = domain.CreateCloneUnit(vLocation, fDuration)
        if (cloneRuntime) {
            let playerid = this.BelongPlayerid;
            if (this.IsRuntimeBuilding()) {
                GBuildingRuntimeEntityRoot.Active(cloneRuntime, playerid, this.ConfigID);
            }
            else if (this.IsEnemy()) {
                GEnemyUnitEntityRoot.Active(cloneRuntime, playerid, this.ConfigID);
            }
            let runtimeroot = cloneRuntime.ETRoot.As<BattleUnitEntityRoot>();
            GGameScene.GetPlayer(playerid).AddDomainChild(runtimeroot);
            runtimeroot.SetStar(this.iStar);
            // wearable
            runtimeroot.WearableComp() && runtimeroot.WearableComp().WearCopy(this.WearableComp());
            // equip
            runtimeroot.InventoryComp() && runtimeroot.InventoryComp().cloneItem(this.InventoryComp());
            // ability
            runtimeroot.AbilityManagerComp() && runtimeroot.AbilityManagerComp().cloneAbility(this.AbilityManagerComp());
            // buff
            runtimeroot.BuffManagerComp() && runtimeroot.BuffManagerComp().cloneRuntimeBuff(this.BuffManagerComp())
            runtimeroot.SyncClient();
            // 不死
            // modifier_never_death.applyOnly(cloneRuntime, cloneRuntime);
            // 回蓝
            return cloneRuntime;
        }
    }

    /**复活 */
    ReSpawn() {
        this.GetDomain<IBaseNpc_Plus>().RespawnUnit();
        (this.isAlive as any) = true;
    }
    SetStar(n: number) {
        this.iStar = n;
        let domain = this.GetDomain<IBaseNpc_Plus>();
        domain.SetStar(n);
        // domain.GetAbilityByIndex(2).SetActivated(n >= 3);
        this.iScale = this.iScale || domain.GetAbsScale();
        let unitroot = domain.ETRoot.As<IBattleUnitEntityRoot>();
        // 饰品
        let levelupconfig = GJSONConfig.BuildingLevelUpConfig.get(domain.GetUnitName());
        if (levelupconfig && this.WearableComp()) {
            let levelup = levelupconfig.StarUpInfo.find(v => v.Star == this.iStar);
            if (levelup) {
                if (levelup.AttachWearables.length > 0) {
                    levelup.AttachWearables.forEach(v => {
                        this.WearableComp().Wear(v, "levelup");
                    })
                }
            }
        }
        // 变大
        domain.StepChangeModelScale(this.iScale * BuildingConfig.MODEL_SCALE[this.iStar - 1]);
        let hullradus = GPropertyCalculate.GetHullBoundSize(domain);
        domain.SetHullRadius(hullradus * BuildingConfig.MODEL_SCALE[this.iStar - 1])
        // 技能升级
        unitroot.AbilityManagerComp().setAllAbilityLevel(n);
        if (!this.checkCanStarUp() && unitroot.IsBuilding()) {
            // 刷新羁绊，5星解锁大招
            unitroot.CombinationComp().refreshCombination();
        }

    }
    /**
     * 获得战力
     * @returns 
     */
    GetScore() {
        return 100
    }

    onVictory() {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (IsValid(npc)) {
            npc.Stop();
            npc.StartGesture(GameActivity_t.ACT_DOTA_VICTORY);
            if (this.IsRuntimeBuilding()) {
                ResHelper.CreateParticle(new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW)
                    .set_resPath("particles/units/heroes/hero_legion_commander/legion_commander_duel_victory.vpcf")
                    .set_validtime(3)
                    .set_owner(npc));
                ResHelper.CreateParticle(new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                    .set_resPath("particles/round/shovel_baby_roshan_spawn.vpcf")
                    .set_validtime(3)
                    .set_owner(npc));
            }
        }
    }


    onKilled(events: EntityKilledEvent): void {
        this.changeAliveState(false);
        this.Dispose();
    }


    OnRound_Start(round?: ERoundBoard): void { }
    OnRound_Battle(round?: ERoundBoard): void { }
    OnRound_Prize(round?: ERoundBoard): void { }
    OnRound_WaitingEnd(): void { }

    IsFriendly() {
        let domain = this.GetDomain<IBaseNpc_Plus>();
        return domain.GetTeamNumber() == DOTATeam_t.DOTA_TEAM_GOODGUYS;
    }
    IsBattleUnit() {
        return true;
    }
    IsSummon() {
        return false;
    }
    IsIllusion() {
        return false;
    }
    IsRuntimeBuilding() {
        return false;
    }
    IsBuilding() {
        return false;
    }
    IsEnemy() {
        return !this.IsFriendly();
    }
    addBattleComp() {
        this.AddComponent(GGetRegClass<typeof ChessMoveComponent>("ChessMoveComponent"));
        this.AddComponent(GGetRegClass<typeof AiAttackComponent>("AiAttackComponent"));
        this.AddComponent(GGetRegClass<typeof WearableComponent>("WearableComponent"), this.GetDotaHeroName());
        this.AddComponent(GGetRegClass<typeof AbilityManagerComponent>("AbilityManagerComponent"));
        this.AddComponent(GGetRegClass<typeof InventoryComponent>("InventoryComponent"));
        this.AddComponent(GGetRegClass<typeof BuffManagerComponent>("BuffManagerComponent"));
    }

    GetDotaHeroName() {
        return "";
    }
    WearableComp() {
        return this.GetComponentByName<WearableComponent>("WearableComponent");
    }
    ChessComp() {
        return this.GetComponentByName<ChessMoveComponent>("ChessMoveComponent");
    }
    AiAttackComp() {
        return this.GetComponentByName<AiAttackComponent>("AiAttackComponent");
    }
    AbilityManagerComp() {
        return this.GetComponentByName<AbilityManagerComponent>("AbilityManagerComponent");
    }
    InventoryComp() {
        return this.GetComponentByName<InventoryComponent>("InventoryComponent");
    }
    BuffManagerComp() {
        return this.GetComponentByName<BuffManagerComponent>("BuffManagerComponent");
    }
    CombinationComp() {
        return this.GetComponentByName<CombinationComponent>("CombinationComponent");
    }
}

declare global {
    type IBattleUnitEntityRoot = BattleUnitEntityRoot;
}