import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
// import { modifier_building } from "../../../modifier/modifier_building";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
/** dota原技能数据 */
export const Data_lone_druid_spirit_bear = { "ID": "5412", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "DisplayAdditionalHeroes": "1", "AbilitySound": "Hero_LoneDruid.SpiritBear.Cast", "HasScepterUpgrade": "1", "AbilityCastPoint": "0.5 0.5 0.5 0.5", "AbilityCooldown": "120.0", "AbilityManaCost": "75 75 75 75", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "bear_hp": "1100 1400 1700 2000" }, "02": { "var_type": "FIELD_INTEGER", "bear_regen_tooltip": "5 6 7 8" }, "03": { "var_type": "FIELD_FLOAT", "bear_bat": "1.75 1.65 1.55 1.45", "LinkedSpecialBonus": "special_bonus_unique_lone_druid_10" }, "04": { "var_type": "FIELD_INTEGER", "bear_armor": "3 4 5 6", "LinkedSpecialBonus": "special_bonus_unique_lone_druid_2" }, "05": { "var_type": "FIELD_FLOAT", "backlash_damage": "20.0" }, "06": { "var_type": "FIELD_FLOAT", "cooldown_scepter": "120.0", "RequiresScepter": "1" }, "07": { "var_type": "FIELD_INTEGER", "movespeed_tooltip": "340 360 380 400" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_lone_druid_spirit_bear extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "lone_druid_spirit_bear";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_lone_druid_spirit_bear = Data_lone_druid_spirit_bear;
    Init() {
        this.SetDefaultSpecialValue("bear_base_damage", [100, 200, 300, 400, 500]);
        this.SetDefaultSpecialValue("bear_hp", [1000, 2000, 3000, 4000, 5000]);
        this.SetDefaultSpecialValue("base_attack_interval", 1.4);
        this.SetDefaultSpecialValue("inherit_attribute_per", [50, 55, 60, 65, 70]);

    }

    CastFilterResultLocation(vLocation: Vector) {
        // if (modifier_building.exist(this.GetCasterPlus())) {
        if (IsServer()) {
            // SnapToGrid(BUILDING_SIZE, vLocation)
            // if (!BuildSystem.ValidPosition(BUILDING_SIZE, vLocation, null)) {
            //     this.errorStr = "dota_hud_error_cant_build_at_location"
            //     returnUnitFilterResult.UF_FAIL_CUSTOM
            // }
        }
        return UnitFilterResult.UF_SUCCESS
        // }
        this.errorStr = "dota_hud_error_only_building_can_use"
        return UnitFilterResult.UF_FAIL_CUSTOM
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let position = this.GetCursorPosition()
        let builder = PlayerResource.GetSelectedHeroEntity(hCaster.GetPlayerOwnerID())
        // SnapToGrid(BUILDING_SIZE, position)
        if (builder != null) {
            // let building = BuildSystem.PlaceBuilding(builder, "spirit_bear_custom", position, BUILDING_ANGLE)
            // if (building) {
            //     hCaster.hSpiritBear = building.GetUnitEntity()
            //     hCaster.hSpiritBear.FireSummonned(hCaster)
            //      modifier_lone_druid_2_buff.apply( hCaster.hSpiritBear , hCaster, this, null)
            //     this.GameTimer(0, () => {
            //         if (type(hCaster.GetBuilding) == "function") {
            //             let hBuilding = hCaster.GetBuilding()
            //             if (IsValid(hBuilding) && hBuilding.QualificationAbilityName != null) {
            //                 hCaster.FireQulificationChanged(hBuilding.QualificationAbilityName)
            //             }
            //         }
            //     })
            // } else {
            this.EndCooldown()
            // }
        }
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_lone_druid_2_buff extends BaseModifier_Plus {
    sQulificationAbility: any;
    //  小熊a帐继承侍从技黑名单
    tInvalidQulificationAbility = [
        "qualification_build_t09",
    ]
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

    BeDestroy() {

        if (IsServer()) {
            this.StartIntervalThink(-1)
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus();
            let hAbility = this.GetAbilityPlus();
            if (!IsValid(hCaster) || !hCaster.IsAlive()) {
                // BuildSystem.RemoveBuilding(hParent)
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }
            // let hReturn = lone_druid_bear_return_custom.findIn(hParent)
            // if (IsValid(hReturn) && hReturn.GetLevel() != hAbility.GetLevel()) {
            //     hReturn.SetLevel(hAbility.GetLevel())
            // }
            // let hEntangle = lone_druid_bear_entangle_custom.findIn(hParent)
            // if (IsValid(hEntangle) && hEntangle.GetLevel() != hAbility.GetLevel()) {
            //     hEntangle.SetLevel(hAbility.GetLevel())
            // }
            // let hDemolish = lone_druid_bear_demolish_custom.findIn(hParent)
            // if (IsValid(hDemolish) && hDemolish.GetLevel() != hAbility.GetLevel()) {
            //     hDemolish.SetLevel(hAbility.GetLevel())
            // }
            //  攻击力
            //  let bear_base_damage = this.GetSpecialValueFor("bear_base_damage")
            //  if ( bear_base_damage != this.bear_base_damage ) {
            //  	hParent.SetBaseDamageMin(hParent.GetBaseDamageMin() - this.bear_base_damage + bear_base_damage)
            //  	hParent.SetBaseDamageMax(hParent.GetBaseDamageMax() - this.bear_base_damage + bear_base_damage)
            //  	this.bear_base_damage = bear_base_damage
            //  }
            //  a帐继承天赋技能
            if (hCaster.HasScepter()) {
                if (this.sQulificationAbility != null && !hParent.HasAbility(this.sQulificationAbility)) {
                    if (this.tInvalidQulificationAbility.indexOf(this.sQulificationAbility) > -1) {
                        let hAbility = hParent.addAbilityPlus(this.sQulificationAbility)
                        if (IsValid(hAbility)) {
                            hParent.SwapAbilities("hidden_qualification", this.sQulificationAbility, false, true)
                        } else {
                            //  TODO:这意味着可能技能名错了，是否有必要设置为空呢？
                            this.sQulificationAbility = null
                        }
                    }
                }
            }
            else {
                if (this.sQulificationAbility != null && hParent.HasAbility(this.sQulificationAbility)) {
                    hParent.SwapAbilities("hidden_qualification", this.sQulificationAbility, false, true)
                    hParent.RemoveAbility(this.sQulificationAbility)
                }
            }
            // 升星
            // hParent.GetBuilding().SetQualificationLevel(hCaster.GetStar() + 2)
            // hParent.FireSummonned(hCaster, true)
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_GetModifierBaseAttack_BonusDamage(params: IModifierTable) {
        return this.GetSpecialValueFor("bear_base_damage")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BASE)
    CC_GetModifierBaseStats_Strength(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        if (IsValid(hCaster)) {
            let inherit_attribute_per = this.GetSpecialValueFor("inherit_attribute_per") + hCaster.GetTalentValue("special_bonus_unique_lone_druid_custom_7")
            return hCaster.GetStrength() * inherit_attribute_per / 100
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BASE)
    CC_GetModifierBaseStats_Agility(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        if (IsValid(hCaster)) {
            let inherit_attribute_per = this.GetSpecialValueFor("inherit_attribute_per") + hCaster.GetTalentValue("special_bonus_unique_lone_druid_custom_7")
            return hCaster.GetAgility() * inherit_attribute_per / 100
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BASE)
    CC_GetModifierBaseStats_Intellect(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        if (IsValid(hCaster)) {
            let inherit_attribute_per = this.GetSpecialValueFor("inherit_attribute_per") + hCaster.GetTalentValue("special_bonus_unique_lone_druid_custom_7")
            return hCaster.GetIntellect() * inherit_attribute_per / 100
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierHealthBonus(params: IModifierTable) {
        return this.GetSpecialValueFor("bear_hp") - 1000 //  NOTE.1000是小熊的kv血量
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_QUALIFICATION_CHANGED)
    OnQualificationChanged(params: IModifierTable) {
        if (this.sQulificationAbility != params.ability_name) {
            let hParent = this.GetParentPlus()
            let hCaster = this.GetCasterPlus()
            if (this.sQulificationAbility != null) {
                if (hParent.HasAbility(this.sQulificationAbility)) {
                    hParent.SwapAbilities("hidden_qualification", this.sQulificationAbility, false, true)
                    hParent.RemoveAbility(this.sQulificationAbility)
                }
            }
            if (params.ability_name == null || params.ability_name == "") {
                this.sQulificationAbility = null
            } else {
                //  无论是否有a帐，都记录技能名，有a帐则添加技能
                this.sQulificationAbility = params.ability_name
                if (hCaster.HasScepter()) {
                    if (this.tInvalidQulificationAbility.indexOf(this.sQulificationAbility) > -1) {
                        let hAbility = hParent.addAbilityPlus(this.sQulificationAbility)
                        if (IsValid(hAbility)) {
                            hParent.SwapAbilities("hidden_qualification", this.sQulificationAbility, false, true)
                        } else {
                            //  TODO:这意味着可能技能名错了，是否有必要设置为空呢？
                            this.sQulificationAbility = null
                        }
                    }
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)

    GetModelChange(params: IModifierTable) {
        return ResHelper.GetModelReplacement("models/heroes/lone_druid/spirit_bear.vmdl", this.GetCasterPlus())
    }


}
