import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
/** dota原技能数据 */
export const Data_bloodseeker_thirst = { "ID": "5017", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "min_bonus_pct": "75" }, "02": { "var_type": "FIELD_INTEGER", "bonus_movement_speed": "14 24 34 44", "LinkedSpecialBonus": "special_bonus_unique_bloodseeker_4" }, "03": { "var_type": "FIELD_INTEGER", "hero_kill_heal": "10 15 20 25" }, "04": { "var_type": "FIELD_INTEGER", "creep_kill_heal": "11 14 17 20" }, "05": { "var_type": "FIELD_INTEGER", "half_bonus_aoe": "300" }, "06": { "var_type": "FIELD_INTEGER", "max_bonus_pct": "25" }, "07": { "var_type": "FIELD_INTEGER", "visibility_threshold_pct": "25" }, "08": { "var_type": "FIELD_INTEGER", "invis_threshold_pct": "25" }, "09": { "var_type": "FIELD_FLOAT", "linger_duration": "4.0" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_bloodseeker_thirst extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "bloodseeker_thirst";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_bloodseeker_thirst = Data_bloodseeker_thirst;
    Init() {
        this.SetDefaultSpecialValue("duration", [2, 2.5, 3, 3.5, 4]);
        this.SetDefaultSpecialValue("base_attack_speed_limit", 700);
        this.SetDefaultSpecialValue("thirst_trigger_ptg", 75);
        this.SetDefaultSpecialValue("max_thirst_trigger_ptg", 25);
        this.SetDefaultSpecialValue("max_attack_speed", [100, 200, 300, 500, 700]);
        this.SetDefaultSpecialValue("residue_duration", [2, 2.5, 3, 3.5, 4]);
        this.SetDefaultSpecialValue("kill_enemy_regen_health", [400, 600, 800, 1000, 1200]);
        this.SetDefaultSpecialValue("per_str_kill_enemy_regen_health_factor", [1, 2, 3, 4, 5]);
        this.SetDefaultSpecialValue("radius", 900);
        this.SetDefaultSpecialValue("doubel_regen_health", 2);

    }



    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }

    GetIntrinsicModifierName() {
        return "modifier_bloodseeker_3"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_bloodseeker_3 extends BaseModifier_Plus {
    base_attack_speed_limit: number;
    max_attack_speed: number;
    thirst_trigger_ptg: number;
    residue_duration: number;
    max_thirst_trigger_ptg: number;
    per_str_kill_enemy_regen_health_factor: number;
    kill_enemy_regen_health: number;
    doubel_regen_health: number;
    duration: number;
    radius: number;
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
    Init(params: ModifierTable) {
        let hParent = this.GetParentPlus()
        this.base_attack_speed_limit = this.GetSpecialValueFor("base_attack_speed_limit")
        this.max_attack_speed = this.GetSpecialValueFor("max_attack_speed") + hParent.GetTalentValue("special_bonus_unique_bloodseeker_custom_4")
        this.thirst_trigger_ptg = this.GetSpecialValueFor("thirst_trigger_ptg")
        this.max_thirst_trigger_ptg = this.GetSpecialValueFor("max_thirst_trigger_ptg")
        this.residue_duration = this.GetSpecialValueFor("residue_duration")
        this.kill_enemy_regen_health = this.GetSpecialValueFor("kill_enemy_regen_health")
        this.per_str_kill_enemy_regen_health_factor = this.GetSpecialValueFor("per_str_kill_enemy_regen_health_factor")
        this.doubel_regen_health = this.GetSpecialValueFor("doubel_regen_health")
        this.radius = this.GetSpecialValueFor("radius")
        this.duration = this.GetSpecialValueFor("duration")
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)
    G_MAX_ATTACKSPEED_BONUS() {
        return this.base_attack_speed_limit
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierTable) {
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (!GameFunc.IsValid(params.target)) { return }
        if (params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == hParent && !params.attacker.IsIllusion()) {
            if (UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                let iHealthPtg = params.target.GetHealthPercent()
                if (iHealthPtg <= this.thirst_trigger_ptg) {
                    let fp = (this.max_attack_speed) * (this.thirst_trigger_ptg - iHealthPtg) / (this.thirst_trigger_ptg - this.max_thirst_trigger_ptg)
                    if (iHealthPtg <= this.max_thirst_trigger_ptg) {
                        fp = this.max_attack_speed
                    }
                    this.SetStackCount(fp)
                    modifier_bloodseeker_3_buff.apply(hParent, hParent, hAbility, { duration: this.residue_duration, fp: fp })
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    On_Death(params: ModifierTable) {
        let hAttacker = params.attacker
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (GameFunc.IsValid(hAttacker) && hAttacker.GetUnitLabel() != "builder") {
            if (hAttacker.GetTeamNumber() == params.unit.GetTeamNumber()) {
                return
            }
            hAttacker = hAttacker.GetSource()
            if (GameFunc.IsValid(hAttacker) && !hAttacker.IsIllusion() && !hAttacker.PassivesDisabled() && params.unit.IsPositionInRange(hParent.GetAbsOrigin(), this.radius)) {
                let fRegenHealth = this.kill_enemy_regen_health + hParent.GetStrength() * this.per_str_kill_enemy_regen_health_factor
                // 自己击杀恢复doubel血量
                if (hAttacker == hParent) {
                    fRegenHealth = fRegenHealth * this.doubel_regen_health
                    // 击杀获取最大攻击速度
                    modifier_bloodseeker_3_Kill_enemy_buff.apply(hParent, hParent, hAbility, { duration: this.duration })
                }
                hParent.ModifyHealth(hParent.GetHealth() + fRegenHealth, hAbility, false, 0)
                // 天赋给友方英雄回血
                if (hParent.HasTalent("special_bonus_unique_bloodseeker_custom_2")) {
                    // BuildSystem.EachBuilding(hParent.GetPlayerOwnerID(), (hBuilding) => {
                    //     let hUnit = hBuilding.GetUnitEntity()
                    //     if (GameFunc.IsValid(hUnit) && hUnit != hParent && hUnit.GetUnitLabel() == "HERO") {
                    //         hUnit.ModifyHealth(hUnit.GetHealth() + fRegenHealth, hAbility, false, 0)
                    //     }
                    // })
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_bloodseeker_3_buff extends BaseModifier_Plus {
    IsHidden() {
        return false
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.SetStackCount(params.fp || 0)
        }
    }
    OnRefresh(params: ModifierTable) {
        super.OnRefresh(params);
        if (IsServer()) {
            this.SetStackCount(params.fp || 0)
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant() {
        return this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_bloodseeker_3_Kill_enemy_buff extends BaseModifier_Plus {
    max_attack_speed: number;
    IsHidden() {
        return false
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
    Init(params: ModifierTable) {
        let hParent = this.GetParentPlus()
        this.max_attack_speed = this.GetSpecialValueFor("max_attack_speed") + hParent.GetTalentValue("special_bonus_unique_bloodseeker_custom_4")
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant() {
        return this.max_attack_speed
    }
}
