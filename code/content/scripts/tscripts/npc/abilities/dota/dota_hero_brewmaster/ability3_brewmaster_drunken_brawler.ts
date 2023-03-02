import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_brewmaster_drunken_brawler = { "ID": "5402", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE", "AbilitySound": "Hero_Brewmaster.Brawler.Crit", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3", "AbilityCastGestureSlot": "DEFAULT", "AbilityCooldown": "29 25 21 17", "AbilityManaCost": "35 40 45 50", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "dodge_chance": "10 15 20 25" }, "02": { "var_type": "FIELD_INTEGER", "crit_chance": "24" }, "03": { "var_type": "FIELD_INTEGER", "active_multiplier": "3" }, "04": { "var_type": "FIELD_INTEGER", "crit_multiplier": "145 160 175 190", "LinkedSpecialBonus": "special_bonus_unique_brewmaster_4" }, "05": { "var_type": "FIELD_INTEGER", "min_movement": "-20" }, "06": { "var_type": "FIELD_INTEGER", "max_movement": "40" }, "07": { "var_type": "FIELD_FLOAT", "duration": "5" } } };

@registerAbility()
export class ability3_brewmaster_drunken_brawler extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "brewmaster_drunken_brawler";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_brewmaster_drunken_brawler = Data_brewmaster_drunken_brawler;
    Init() {
        this.SetDefaultSpecialValue("inherit_attribute_per", [30, 35, 40, 45, 55]);

    }


    GetIntrinsicModifierName() {
        return "modifier_brewmaster_3"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_brewmaster_3 extends BaseModifier_Plus {
    iPlayerOwnerID: number;
    IsHidden() {
        return true
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    BeCreated(params: IModifierTable) {

        let hParent = this.GetParentPlus()
        this.iPlayerOwnerID = hParent.GetPlayerOwnerID()
        if (IsServer()) {
            this.StartIntervalThink(0)
        }
    }

    BeDestroy() {

        if (IsServer()) {
            this.DeletAbility()
        }
    }
    AddAbility(sAbilityName: string, hUnit: IBaseNpc_Plus) {
        let hParent = this.GetParentPlus()
        let hAbility = hParent.FindAbilityByName(sAbilityName)
        let hAbility_t27 = hUnit.FindAbilityByName(sAbilityName)
        if (GFuncEntity.IsValid(hAbility)) {
            if (!GFuncEntity.IsValid(hAbility_t27)) {
                hAbility_t27 = hUnit.AddAbility(sAbilityName)
                hAbility_t27.SetLevel(hAbility.GetLevel())
                hUnit.SwapAbilities(sAbilityName, "empty_5", true, false)
                hUnit.RemoveAbility("empty_5")
                if (!hAbility_t27.GetAutoCastState()) {
                    hAbility_t27.ToggleAutoCast()
                }
            } else {
                if (hAbility_t27.GetLevel() != hAbility.GetLevel()) {
                    hAbility_t27.SetLevel(hAbility.GetLevel())
                }
            }
        }
    }
    DeletAbility() {
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            // BuildSystem.EachBuilding(this.iPlayerOwnerID, (hBuilding) => {
            //     let hUnit = hBuilding.GetUnitEntity()
            //     if (GFuncEntity.IsValid(hUnit)) {
            //         // 风元素使
            //         if (hUnit.GetUnitName() == "t27" && hUnit.HasAbility("brewmaster_3")) {
            //             let empty_5 = hUnit.AddAbility("empty_5")
            //             hUnit.SwapAbilities("brewmaster_3", "empty_5", false, true)
            //             hUnit.RemoveAbility("brewmaster_3")
            //         }
            //         // 土元素使
            //         if (hUnit.GetUnitName() == "t28" && hUnit.HasAbility("brewmaster_1")) {
            //             let empty_5 = hUnit.AddAbility("empty_5")
            //             hUnit.SwapAbilities("brewmaster_1", "empty_5", false, true)
            //             hUnit.RemoveAbility("brewmaster_1")
            //         }
            //         // 火元素使
            //         if (hUnit.GetUnitName() == "t29" && hUnit.HasAbility("brewmaster_2")) {
            //             let empty_5 = hUnit.AddAbility("empty_5")
            //             hUnit.SwapAbilities("brewmaster_2", "empty_5", false, true)
            //             hUnit.RemoveAbility("brewmaster_2")
            //         }
            //     }
            // })
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            if (hParent.IsIllusion() || hParent.IsClone()) {
                this.Destroy()
                return
            }
            let hAbility = this.GetAbilityPlus()
            // BuildSystem.EachBuilding(hParent.GetPlayerOwnerID(), (hBuilding) => {
            //     let hUnit = hBuilding.GetUnitEntity()
            //     if (GFuncEntity.IsValid(hUnit)) {
            //         // 风元素使
            //         if (hUnit.GetUnitName() == "t27") {
            //             // 继承属性
            //              modifier_brewmaster_3_inherit_attribute.apply( hUnit , hParent, hAbility, null)
            //             // 继承技能
            //             if (hParent.HasScepter()) {
            //                 // 继承醉拳
            //                 this.AddAbility("brewmaster_3", hUnit)
            //             } else {
            //                 this.DeletAbility()
            //             }
            //             // 天赋提升30%全伤害
            //             let hModifier = hParent.FindModifierByNameAndCaster("modifier_brewmaster_3_amplify_damage", hUnit) as IBaseModifier_Plus
            //             if (hParent.HasTalent("special_bonus_unique_brewmaster_custom_7") && !GFuncEntity.IsValid(hModifier)) {
            //                  modifier_brewmaster_3_amplify_damage.apply( hParent , hUnit, hAbility, null)
            //             }
            //         }
            //         // 土元素使
            //         if (hUnit.GetUnitName() == "t28") {
            //             // 继承属性
            //              modifier_brewmaster_3_inherit_attribute.apply( hUnit , hParent, hAbility, null)
            //             // 继承技能
            //             if (hParent.HasScepter()) {
            //                 // 继承雷霆一击
            //                 this.AddAbility("brewmaster_1", hUnit)
            //             } else {
            //                 this.DeletAbility()
            //             }
            //             // 天赋提升30%全伤害
            //             let hModifier = hParent.FindModifierByNameAndCaster("modifier_brewmaster_3_amplify_damage", hUnit) as IBaseModifier_Plus
            //             if (hParent.HasTalent("special_bonus_unique_brewmaster_custom_7") && !GFuncEntity.IsValid(hModifier)) {
            //                  modifier_brewmaster_3_amplify_damage.apply( hParent , hUnit, hAbility, null)
            //             }
            //         }
            //         // 火元素使
            //         if (hUnit.GetUnitName() == "t29") {
            //             // 继承属性
            //              modifier_brewmaster_3_inherit_attribute.apply( hUnit , hParent, hAbility, null)
            //             // 继承技能
            //             if (hParent.HasScepter()) {
            //                 // 继承余烬佳酿
            //                 this.AddAbility("brewmaster_2", hUnit)
            //             } else {
            //                 this.DeletAbility()
            //             }
            //             // 天赋提升30%全伤害
            //             let hModifier = hParent.FindModifierByNameAndCaster("modifier_brewmaster_3_amplify_damage", hUnit) as IBaseModifier_Plus
            //             if (hParent.HasTalent("special_bonus_unique_brewmaster_custom_7") && !GFuncEntity.IsValid(hModifier)) {
            //                  modifier_brewmaster_3_amplify_damage.apply( hParent , hUnit, hAbility, null)
            //             }
            //         }
            //         // 虚无元素使
            //         if (hUnit.GetUnitName() == "npc_void_element_custom") {
            //             // 天赋提升30%全伤害
            //             let hModifier = hParent.FindModifierByNameAndCaster("modifier_brewmaster_3_amplify_damage", hUnit) as IBaseModifier_Plus
            //             if (hParent.HasTalent("special_bonus_unique_brewmaster_custom_7") && !GFuncEntity.IsValid(hModifier)) {
            //                  modifier_brewmaster_3_amplify_damage.apply( hParent , hUnit, hAbility, null)
            //             }
            //         }
            //     }
            // })
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_brewmaster_3_inherit_attribute extends BaseModifier_Plus {
    inherit_attribute_per: number;
    IsHidden() {
        return true
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            this.StartIntervalThink(0)
        }
    }
    Init(params: IModifierTable) {
        this.inherit_attribute_per = this.GetSpecialValueFor("inherit_attribute_per")
    }
    BeDestroy() {

        if (IsServer()) {
            this.StartIntervalThink(-1)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus()
            if (!GFuncEntity.IsValid(hCaster) || !hCaster.IsAlive()) {
                this.Destroy()
                return
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength() {
        let hCaster = this.GetCasterPlus()
        if (GFuncEntity.IsValid(this.GetCasterPlus())) {
            return hCaster.GetStrength() * (this.inherit_attribute_per + hCaster.GetTalentValue("special_bonus_unique_brewmaster_custom_8")) * 0.01
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility() {
        let hCaster = this.GetCasterPlus()
        if (GFuncEntity.IsValid(this.GetCasterPlus())) {
            return hCaster.GetAgility() * (this.inherit_attribute_per + hCaster.GetTalentValue("special_bonus_unique_brewmaster_custom_8")) * 0.01
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect() {
        let hCaster = this.GetCasterPlus()
        if (GFuncEntity.IsValid(this.GetCasterPlus())) {
            return hCaster.GetIntellect() * (this.inherit_attribute_per + hCaster.GetTalentValue("special_bonus_unique_brewmaster_custom_8")) * 0.01
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_brewmaster_3_amplify_damage extends BaseModifier_Plus {
    IsHidden() {
        return true
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    BeCreated(params: IModifierTable) {

        let hParent = this.GetParentPlus()
        if (IsServer()) {
            this.StartIntervalThink(0)
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus()
            if (!GFuncEntity.IsValid(hCaster) || !hCaster.IsAlive()) {
                this.Destroy()
                return
            }
        }
    }
    BeDestroy() {

        if (IsServer()) {
            this.StartIntervalThink(-1)
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_DAMAGE_PERCENTAGE)
    G_OUTGOING_DAMAGE_PERCENTAGE() {
        return this.GetParentPlus().GetTalentValue("special_bonus_unique_brewmaster_custom_7")
    }
}
