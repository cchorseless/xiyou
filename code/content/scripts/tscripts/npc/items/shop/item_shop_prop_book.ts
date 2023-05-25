import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { ActiveRootItemWithCharge } from "../ActiveRootItem";

// 全属性之书
@registerAbility()
export class item_shop_stat_all_book extends ActiveRootItemWithCharge {
    CastFilterResultTarget(target: CDOTA_BaseNPC) {
        if (IsServer()) {
            let battleroot = target.ETRoot as IBattleUnitEntityRoot;
            if (battleroot && battleroot.IsBuilding && battleroot.IsBuilding()) {
                return UnitFilterResult.UF_SUCCESS
            }
            else {
                this.errorStr = "只能对棋子使用"
            }
            return UnitFilterResult.UF_FAIL_CUSTOM
        }
        return UnitFilterResult.UF_SUCCESS
    }

    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        return this.errorStr;
    }

    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        let battleroot = target.ETRoot as IBuildingEntityRoot;
        if (battleroot && battleroot.IsBuilding && battleroot.IsBuilding() && battleroot.checkCanStarUp()) {
            modifier_item_shop_stat_all_book.apply(target, target, this as any)
            this.CostOneCharge();
        }
    }
}

@registerModifier()
export class modifier_item_shop_stat_all_book extends BaseModifier_Plus {
    public Init(params?: IModifierTable): void {
        if (IsServer()) {
            this.IncrementStackCount(this.GetSpecialValueFor("add_value"))
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_ALL_BONUS)
    CC_STATS_ALL_BONUS() {
        return this.GetStackCount();
    }

}

// 主属性之书
@registerAbility()
export class item_shop_stat_primary_book extends item_shop_stat_all_book {



    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        let battleroot = target.ETRoot as IBuildingEntityRoot;
        if (battleroot && battleroot.IsBuilding && battleroot.IsBuilding() && battleroot.checkCanStarUp()) {
            modifier_item_shop_stat_primary_book.apply(target, target, this as any)
            this.CostOneCharge();
        }
    }
}
@registerModifier()
export class modifier_item_shop_stat_primary_book extends BaseModifier_Plus {
    public Init(params?: IModifierTable): void {
        if (IsServer()) {
            this.IncrementStackCount(this.GetSpecialValueFor("add_value"))
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_PRIMARY_BONUS)
    CC_STATS_PRIMARY_BONUS() {
        return this.GetStackCount();
    }

}
// 力量之书
@registerAbility()
export class item_shop_stat_strength_book extends item_shop_stat_all_book {



    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        let battleroot = target.ETRoot as IBuildingEntityRoot;
        if (battleroot && battleroot.IsBuilding && battleroot.IsBuilding() && battleroot.checkCanStarUp()) {
            modifier_item_shop_stat_strength_book.apply(target, target, this as any)
            this.CostOneCharge();
        }
    }
}
@registerModifier()
export class modifier_item_shop_stat_strength_book extends BaseModifier_Plus {
    public Init(params?: IModifierTable): void {
        if (IsServer()) {
            this.IncrementStackCount(this.GetSpecialValueFor("add_value"))
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_STATS_STRENGTH_BONUS() {
        return this.GetStackCount();
    }
}
// 敏捷之书
@registerAbility()
export class item_shop_stat_agility_book extends item_shop_stat_all_book {



    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        let battleroot = target.ETRoot as IBuildingEntityRoot;
        if (battleroot && battleroot.IsBuilding && battleroot.IsBuilding() && battleroot.checkCanStarUp()) {
            modifier_item_shop_stat_agility_book.apply(target, target, this as any)
            this.CostOneCharge();
        }
    }
}
@registerModifier()
export class modifier_item_shop_stat_agility_book extends BaseModifier_Plus {
    public Init(params?: IModifierTable): void {
        if (IsServer()) {
            this.IncrementStackCount(this.GetSpecialValueFor("add_value"))
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_STATS_AGILITY_BONUS() {
        return this.GetStackCount();
    }
}
// 智力之书
@registerAbility()
export class item_shop_stat_intelligence_book extends item_shop_stat_all_book {



    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        let battleroot = target.ETRoot as IBuildingEntityRoot;
        if (battleroot && battleroot.IsBuilding && battleroot.IsBuilding() && battleroot.checkCanStarUp()) {
            modifier_item_shop_stat_intelligence_book.apply(target, target, this as any)
            this.CostOneCharge();
        }
    }
}

@registerModifier()
export class modifier_item_shop_stat_intelligence_book extends BaseModifier_Plus {
    public Init(params?: IModifierTable): void {
        if (IsServer()) {
            this.IncrementStackCount(this.GetSpecialValueFor("add_value"))
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_STATS_INTELLECT_BONUS() {
        return this.GetStackCount();
    }
}