
import { modifier_no_health_bar } from "../../../npc/modifier/modifier_no_health_bar";
import { modifier_hero_property } from "../../../npc/propertystat/modifier_hero_property";
import { BuildingConfig } from "../../../shared/BuildingConfig";
import { serializeETProps } from "../../../shared/lib/Entity";
import { BaseEntityRoot } from "../../Entity/BaseEntityRoot";
import { AbilityManagerComponent } from "../Ability/AbilityManagerComponent";
import { AiAttackComponent } from "../AI/AiAttackComponent";
import { BuffManagerComponent } from "../Buff/BuffManagerComponent";
import { ChessMoveComponent } from "../ChessControl/ChessMoveComponent";
import { CombinationComponent } from "../Combination/CombinationComponent";
import { InventoryComponent } from "../Inventory/InventoryComponent";
import { RoundStateComponent } from "../Round/RoundStateComponent";
import { WearableComponent } from "../Wearable/WearableComponent";

export class BattleUnitEntityRoot extends BaseEntityRoot {
    public iScale: number = 1;
    @serializeETProps()
    public iLevel: number = 1;
    @serializeETProps()
    public iStar: number = 1;
    @serializeETProps()
    public IsShowOverhead: boolean = false;
    @serializeETProps()
    public PrimaryAttribute: number = 1;

    onInit() {
        this.iScale = this.GetDomain<IBaseNpc_Plus>().GetAbsScale();
        let domain = this.GetDomain<IBaseNpc_Plus>();
        const m = modifier_hero_property.applyOnly(domain, domain);
        m.StackCountHandler = GHandler.create(this, (attr: Attributes) => {
            this.PrimaryAttribute = attr;
            this.SyncClient(true);
        }, null, false);
        this.SetUIOverHead(true, false);
        this.SetStar(1);
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

    /**是否可以升星 */
    checkCanStarUp() {
        return this.iStar < BuildingConfig.MAX_STAR;
    }

    SetStar(n: number) {
        this.iStar = n;
        let domain = this.GetDomain<IBaseNpc_Plus>();
        let building = domain.ETRoot.As<IBattleUnitEntityRoot>();
        // 变大
        domain.SetModelScale(this.iScale * BuildingConfig.MODEL_SCALE[this.iStar - 1]);
        // 技能升级
        building.AbilityManagerComp().setAllAbilityLevel(n);
        // 属性
    }


    onVictory() {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (GFuncEntity.IsValid(npc)) {
            npc.Stop();
            npc.StartGesture(GameActivity_t.ACT_DOTA_VICTORY);
        }
    }


    onKilled(events: EntityKilledEvent): void {
        this.ChessComp()?.changeAliveState(false);
        this.AiAttackComp()?.endFindToAttack();
        let npc = this.GetDomain<IBaseNpc_Plus>();
        npc.StartGesture(GameActivity_t.ACT_DOTA_DIE);
    }


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
        this.AddComponent(GGetRegClass<typeof RoundStateComponent>("RoundStateComponent"));
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
    RoundStateComp() {
        return this.GetComponentByName<RoundStateComponent>("RoundStateComponent");
    }
}

declare global {
    type IBattleUnitEntityRoot = BattleUnitEntityRoot;
}