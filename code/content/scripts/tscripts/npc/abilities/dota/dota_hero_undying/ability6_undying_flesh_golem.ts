
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_undying_flesh_golem = { "ID": "5447", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "FightRecapLevel": "2", "AbilitySound": "Hero_Undying.FleshGolem", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "125", "AbilityManaCost": "100 125 150", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "slow": "40 45 50" }, "02": { "var_type": "FIELD_INTEGER", "damage_amp": "25 30 35" }, "03": { "var_type": "FIELD_FLOAT", "slow_duration": "6" }, "04": { "var_type": "FIELD_INTEGER", "str_percentage": "40 50 60" }, "05": { "var_type": "FIELD_FLOAT", "duration": "40" }, "06": { "var_type": "FIELD_INTEGER", "movement_bonus": "30" } } };

@registerAbility()
export class ability6_undying_flesh_golem extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "undying_flesh_golem";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_undying_flesh_golem = Data_undying_flesh_golem;
    Init() {
        this.SetDefaultSpecialValue("slow", 40);
        this.SetDefaultSpecialValue("slow_duration", 5);
        this.SetDefaultSpecialValue("str_percentage", [30, 35, 40, 45, 50, 55]);
        this.SetDefaultSpecialValue("duration", 20);
        this.SetDefaultSpecialValue("increase_all_damage_pct", [10, 14, 18, 22, 26, 30]);
        this.SetDefaultSpecialValue("cast_point_scepter", 90);

    }

    Init_old() {
        this.SetDefaultSpecialValue("zombie_duration", 7);
        this.SetDefaultSpecialValue("zombie_radius", 500);
        this.SetDefaultSpecialValue("zombie_base_damage", [20, 40, 80, 160, 320, 640]);
        this.SetDefaultSpecialValue("zombie_damag_str_factor", 1);
        this.SetDefaultSpecialValue("health_threshold_pct_tooltip", 40);
        this.SetDefaultSpecialValue("zombie_damage_pct", 2);
        this.SetDefaultSpecialValue("cast_point_scepter", 90);
        this.SetDefaultSpecialValue("tomb_stone_max_distance", 1000);
        this.SetDefaultSpecialValue("slow", 40);
        this.SetDefaultSpecialValue("posion_count", [15, 30, 60, 120, 240, 480]);
        this.SetDefaultSpecialValue("slow_duration", 5);
        this.SetDefaultSpecialValue("str_percentage", [45, 50, 55, 60, 65, 70]);
        this.SetDefaultSpecialValue("duration", 20);

    }


    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        modifier_undying_6_buff.apply(hCaster, hCaster, this, { duration: this.GetSpecialValueFor("duration") })
        hCaster.EmitSound("Hero_Undying.FleshGolem.Cast")
    }

    GetIntrinsicModifierName() {
        return "modifier_undying_6"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
//  Modifiers
@registerModifier()
export class modifier_undying_6 extends BaseModifier_Plus {
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (!GameFunc.IsValid(ability)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let caster = ability.GetCasterPlus()
            if (!GameFunc.IsValid(caster)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            if (!ability.GetAutoCastState()) {
                return
            }

            if (caster.IsTempestDouble() || caster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }

            let range = caster.Script_GetAttackRange()
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable(
                    {
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                        AbilityIndex: ability.entindex()
                    }
                )
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_undying_6_buff extends BaseModifier_Plus {
    fSlowDuration: number;
    iStrPct: number;
    cast_point_scepter: number;
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
        return true
    }
    GetEffectName() {
        return "particles/units/heroes/hero_undying/undying_fg_aura.vpcf"
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.GetParentPlus().EmitSound("Hero_Undying.FleshGolem.Aura")
        }

    }
    Init(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        this.fSlowDuration = this.GetSpecialValueFor("slow_duration")
        this.iStrPct = this.GetSpecialValueFor("str_percentage") + hParent.GetTalentValue("special_bonus_unique_undying_custom_7")
        this.cast_point_scepter = this.GetSpecialValueFor("cast_point_scepter")
    }
    OnDestroy() {
        super.OnDestroy()
        if (IsServer()) {
            this.GetParentPlus().EmitSound("Hero_Undying.FleshGolem.End")
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    tooltip() {
        return this.iStrPct
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_PERCENTAGE)
    EOM_GetModifierStats_Strength_Percentage() {
        return this.iStrPct
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    attackLanded(params: IModifierTable) {
        if (!GameFunc.IsValid(params.target)) { return }
        if (params.target.GetClassname() == "dota_item_drop") { return }
        if (GameFunc.IsValid(this.GetCasterPlus()) && params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion() && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
            modifier_undying_6_slow.apply(params.target, this.GetCasterPlus(), this.GetAbilityPlus(), { duration: this.fSlowDuration })
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)
    GetModelChange() {
        return ResHelper.GetModelReplacement("models/heroes/undying/undying_flesh_golem.vmdl", this.GetCasterPlus())
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CASTTIME_PERCENTAGE)
    GetPercentageCasttime() {
        if (GameFunc.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().HasScepter()) {
            return this.cast_point_scepter
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_undying_6_slow extends BaseModifier_Plus {
    iSlow: number;
    increase_all_damage_pct: number;
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
    RemoveOnDeath() {
        return true
    }
    GetEffectName() {
        return "particles/units/heroes/hero_undying/undying_fg_aura_debuff.vpcf"
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    Init(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.iSlow = this.GetSpecialValueFor("slow")
        this.increase_all_damage_pct = this.GetSpecialValueFor("increase_all_damage_pct")
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(tParams: any) {
        return -this.iSlow
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    tooltip() {
        return this.increase_all_damage_pct
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    EOM_GetModifierIncomingDamagePercentage(params: IModifierTable) {
        return this.increase_all_damage_pct
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_undying_6_zombie_lifetime extends BaseModifier_Plus {
    IsHidden() {
        return true
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
    }
    OnDestroy() {
        super.OnDestroy();
        let hParent = this.GetParentPlus()
        if (IsServer() && GameFunc.IsValid(hParent)) {
            hParent.AddNoDraw()
            hParent.ForceKill(false)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: this.GetElapsedTime() <= 1 / 30
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.LIFETIME_FRACTION)
    Get_UnitLifetimeFraction() {
        return this.GetRemainingTime() / this.GetDuration()
    }


}
