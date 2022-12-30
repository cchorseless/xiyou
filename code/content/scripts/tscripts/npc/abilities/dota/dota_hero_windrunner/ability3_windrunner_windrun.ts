
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Hero_Plus } from "../../../entityPlus/BaseNpc_Hero_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_windrunner_windrun = { "ID": "5132", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "Ability.Windrun", "HasScepterUpgrade": "1", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "15 14 13 12", "AbilityDuration": "3 4 5 6", "AbilityManaCost": "50", "AbilityModifierSupportValue": "0.1", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "movespeed_bonus_pct": "60" }, "02": { "var_type": "FIELD_INTEGER", "evasion_pct_tooltip": "100" }, "03": { "var_type": "FIELD_INTEGER", "enemy_movespeed_bonus_pct": "-15 -20 -25 -30", "LinkedSpecialBonus": "special_bonus_unique_windranger_2" }, "04": { "var_type": "FIELD_INTEGER", "radius": "325" }, "05": { "var_type": "FIELD_FLOAT", "duration": "3 4 5 6" }, "06": { "var_type": "FIELD_INTEGER", "max_charges": "2", "RequiresScepter": "1" }, "07": { "var_type": "FIELD_INTEGER", "charge_restore_time": "15 14 13 12", "RequiresScepter": "1" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_windrunner_windrun extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "windrunner_windrun";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_windrunner_windrun = Data_windrunner_windrun;
    Init() {
        this.SetDefaultSpecialValue("per_damage", [230, 600, 1300, 2000, 4000]);
        this.SetDefaultSpecialValue("attack_interval", [1.4, 1.4, 1.4, 1.4, 1.3]);
        this.SetDefaultSpecialValue("state_resistance", [15, 25, 40, 55, 60]);
        this.SetDefaultSpecialValue("radius", 1000);
        this.SetDefaultSpecialValue("duration", 6);
        this.SetDefaultSpecialValue("int_factor", [1, 2, 4, 6, 9]);

    }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration")
        modifier_windrunner_3_buff.apply(hCaster, hCaster, this, { duration: duration })
    }
    // GetIntrinsicModifierName() {
    //     return "modifier_windrunner_3"
    // }


}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_windrunner_3 extends BaseModifier_Plus {
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (ability == null || ability.IsNull()) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let hCaster = ability.GetCasterPlus()

            if (!GameFunc.IsValid(hCaster)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            if (!ability.GetAutoCastState()) {
                return
            }

            if (hCaster.IsTempestDouble() || hCaster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }
            if (modifier_windrunner_3_buff.exist(hCaster)) {
                ;
                return
            }

            let range = ability.GetSpecialValueFor("radius")
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets.length > 0) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex()
                })
            }
        }
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_windrunner_3_buff extends BaseModifier_Plus {
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
    GetEffectName() {
        return "particles/units/heroes/hero_windrunner/windrunner_windrun.vpcf"
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    IsAura() {
        return true
    }
    GetModifierAura() {
        return "modifier_windrunner_3_debuff"
    }
    GetAuraRadius() {
        return this.radius
    }
    GetAuraEntityReject(hEntity: IBaseNpc_Plus) {
        return false
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
    }
    radius: number;
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    state_resistance: number;
    attack_interval: number;
    Init(params: ModifierTable) {
        this.radius = this.GetSpecialValueFor("radius")
        this.state_resistance = this.GetSpecialValueFor("state_resistance")
        this.attack_interval = this.GetSpecialValueFor("attack_interval")
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT)
    GetBaseAttackTimeConstant() {
        return this.attack_interval
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    Tooltip() {
        return this.state_resistance
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage() {
        return this.GetCasterPlus().GetTalentValue("special_bonus_unique_windrunner_custom_6")
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_windrunner_3_debuff extends BaseModifier_Plus {
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
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
    GetEffectName() {
        return "particles/units/heroes/hero_windrunner/windrunner_windrun_slow.vpcf"
        //  return "particles/units/heroes/hero_windrunner/windrunner_windrun.vpcf"
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params)
        if (IsServer()) {
            this.StartIntervalThink(0.5)
        }
    }
    per_damage: number;
    int_factor: number;
    Init(params: ModifierTable) {
        this.per_damage = this.GetSpecialValueFor("per_damage")
        this.int_factor = this.GetSpecialValueFor("int_factor")
    }

    OnIntervalThink() {
        let hCaster = this.GetCasterPlus() as BaseNpc_Hero_Plus;
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsServer()) {
            if (GameFunc.IsValid(hCaster)) {
                let damage_table =
                {
                    ability: hAbility,
                    attacker: hCaster,
                    victim: hParent,
                    damage: hCaster.GetIntellect() * this.int_factor + this.per_damage * 0.5,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                }
                BattleHelper.GoApplyDamage(damage_table)
            }
        }
    }
}