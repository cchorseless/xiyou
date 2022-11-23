
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { GameEnum } from "../../../shared/GameEnum";
import { unit_ward_observer } from "../../units/common/unit_ward_observer";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { HashTableHelper } from "../../../helper/HashTableHelper";

/** dota原道具数据 */
export const Data_item_ward_observer_custom = { "ID": "42", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_OPTIONAL_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_SUPPRESS_ASSOCIATED_CONSUMABLE", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_FRIENDLY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO", "Model": "models/props_gameplay/observer_ward_bundle.vmdl", "AbilityCastRange": "500", "AbilityCastPoint": "0.0", "AbilityCooldown": "1.0", "ItemCost": "0", "ItemShopTags": "consumable", "ItemQuality": "consumable", "ItemAliases": "observer ward", "ItemStackable": "1", "ItemShareability": "ITEM_FULLY_SHAREABLE", "ItemPermanent": "0", "ItemInitialCharges": "1", "ItemStockMax": "4", "ItemStockInitial": "2", "ItemStockTime": "135.0", "ItemDeclarations": "DECLARE_PURCHASES_TO_TEAMMATES", "ItemSupport": "1", "IsTempestDoubleClonable": "0", "ShouldBeInitiallySuggested": "1", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "lifetime": "360" }, "02": { "var_type": "FIELD_INTEGER", "vision_range_tooltip": "1600" }, "03": { "var_type": "FIELD_INTEGER", "health": "200" }, "04": { "var_type": "FIELD_INTEGER", "duration_minutes_tooltip": "6" } } };
// 侦查守卫
@registerAbility()
export class item_ward_observer_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_ward_observer";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_ward_observer_custom = Data_item_ward_observer_custom;


};


@registerModifier()
export class modifier_vision extends BaseModifier_Plus {

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.BONUS_DAY_VISION)
    day_vision() {
        return this.GetStackCount()
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.BONUS_NIGHT_VISION)
    night_vision() {
        return this.GetStackCount()
    }

    Init(params: ModifierTable) {
        if (params.stack) {
            this.SetStackCount(params.stack)
        }
    }

    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_FORCED_FLYING_VISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
        }
    }

    OnRemoved() {
        // this.GetParentPlus()?.SafeDestroy();
    }
    /**
     * 创建有视野的单位
     * @param caster
     * @param position
     * @param teamnumber
     * @param duration
     * @param stack 层数来描述视野
     */
    static CreateVisionUnit(caster: BaseNpc_Plus, position: Vector, teamnumber: DOTATeam_t, duration: number = null, stack: number = 1) {
        let unit = unit_ward_observer.CreateOne(position, teamnumber, false, caster, caster);
        unit.AddNoDraw();
        modifier_vision.apply(unit, caster, null, {
            duration: duration,
            stack: stack,
        })
    }
}
