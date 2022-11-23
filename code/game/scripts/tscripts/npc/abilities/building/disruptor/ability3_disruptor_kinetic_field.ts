import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_shock } from "../../../modifier/effect/modifier_shock";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_disruptor_kinetic_field = { "ID": "5460", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_Disruptor.KineticField", "AbilityCastAnimation": "ACT_DOTA_KINETIC_FIELD", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastPoint": "0.05 0.05 0.05 0.05", "AbilityCooldown": "19 16 13 10", "AbilityManaCost": "70 70 70 70", "AbilityCastRange": "900 900 900 900", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "350" }, "02": { "var_type": "FIELD_FLOAT", "formation_time": "1.2 1.2 1.2 1.2" }, "03": { "var_type": "FIELD_FLOAT", "duration": "2.6 3.2 3.8 4.4", "LinkedSpecialBonus": "special_bonus_unique_disruptor_5" } } };

@registerAbility()
export class ability3_disruptor_kinetic_field extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "disruptor_kinetic_field";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_disruptor_kinetic_field = Data_disruptor_kinetic_field;
    Init() {
        this.SetDefaultSpecialValue("shock_active_pct", [200, 250, 300, 350, 400, 500]);
        this.SetDefaultSpecialValue("shock_damage_increase", [20, 21, 22, 23, 25, 25]);
        this.SetDefaultSpecialValue("stun_duration", 1.3);
        this.SetDefaultSpecialValue("duration", [2.5, 2.8, 3.1, 3.4, 3.7, 4.0]);
        this.SetDefaultSpecialValue("radius", 300);

    }


    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let caster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let duration = this.GetSpecialValueFor("duration")
        modifier_disruptor_2_thinker.applyThinker(vPosition, caster, this, { duration: duration }, caster.GetTeamNumber(), false)
        modifier_disruptor_2_field.applyThinker(vPosition, caster, this, { duration: duration }, caster.GetTeamNumber(), false)
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_disruptor_2"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_disruptor_2 extends BaseModifier_Plus {
    private _vLastPosition: any;
    IsHidden() {
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    order(params: ModifierTable) {
        if (IsServer()) {
            let hAbility = this.GetAbilityPlus()
            if (params.issuer_player_index != -1 && params.ability == hAbility) {
                if (params.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION) {
                    this._vLastPosition = params.new_pos
                } else if (params.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO) {
                    let bState = hAbility.GetAutoCastState()
                    if (bState) { //  此函数在切换前被调用的
                        this._vLastPosition = null
                    }
                }
            }
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

            let hCaster = ability.GetCasterPlus()

            if (!ability.GetAutoCastState()) {
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }
            if (this._vLastPosition) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: this._vLastPosition
                })
                return
            }
            let range = ability.GetCastRange(hCaster.GetAbsOrigin(), hCaster) + hCaster.GetCastRangeBonus()
            let radius = ability.GetAOERadius()
            let vPos = AoiHelper.GetAOEMostTargetsPosition(hCaster.GetAbsOrigin(), range, hCaster.GetTeam(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0)
            if (vPos != vec3_invalid) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: (vPos) as Vector
                })
            }
        }
    }
}
//  Modifiers
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_disruptor_2_debuff extends BaseModifier_Plus {
    iShockDamageIncrease: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
    }
    IsPurgable() {
        return true
    }
    IsPurgeException() {
        return true
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: ModifierTable) {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            this.iShockDamageIncrease = this.GetSpecialValueFor("shock_damage_increase") + hCaster.GetTalentValue("special_bonus_unique_disruptor_custom_6")
            this.SetStackCount(this.iShockDamageIncrease)
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_SHOCK_DAMAGE_PERCENTAGE)
    g_INCOMING_SHOCK_DAMAGE_PERCENTAGE() {
        return this.iShockDamageIncrease
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    tooltip(params: ModifierTable) {
        return this.GetStackCount()
    }
}
//  Modifiers
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_disruptor_2_field_aura extends BaseModifier_Plus {
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
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
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let fStunDuration = this.GetSpecialValueFor("stun_duration")
            let iShockPercent = this.GetSpecialValueFor("shock_active_pct")
            modifier_shock.ShockActive(hParent, hCaster, this.GetAbilityPlus(), iShockPercent, false)
            modifier_stunned.apply(hParent, hCaster, this.GetAbilityPlus(), {
                duration: fStunDuration * (100 - hParent.GetStatusResistance()) * 0.01
            })
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let fStunDuration = this.GetSpecialValueFor("stun_duration")
            let iShockPercent = this.GetSpecialValueFor("shock_active_pct")
            modifier_shock.ShockActive(hParent, hCaster, this.GetAbilityPlus(), iShockPercent, false)
            modifier_stunned.apply(hParent, hCaster, this.GetAbilityPlus(), {
                duration: fStunDuration * (100 - hParent.GetStatusResistance()) * 0.01
            })
        }
    }
}
//  Modifiers
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_disruptor_2_field extends BaseModifier_Plus {
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
    IsAura() {
        return true
    }
    GetAura() {
        return "modifier_disruptor_2_field_aura"
    }
    GetAuraRadius() {
        return this.radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }
    GetAuraDuration() {
        return 0
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.radius = this.GetSpecialValueFor("radius")
        } else {
            let hCaster = this.GetCasterPlus()
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_disruptor/disruptor_kineticfield.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.GetSpecialValueFor("radius"), 0, 0))
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(this.GetDuration(), 0, 0))
            this.AddParticle(iParticleID, false, false, -1, false, false)
            EmitSoundOn("Hero_Disruptor.KineticField", this.GetParentPlus())
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            EmitSoundOn("Hero_Disruptor.KineticField.End", this.GetParentPlus())
            UTIL_Remove(this.GetParentPlus())
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_FLYING]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
        }
    }
}
//  Modifiers
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_disruptor_2_thinker extends BaseModifier_Plus {
    radius: any;
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
    IsAura() {
        return true
    }
    GetAura() {
        return "modifier_disruptor_2_debuff"
    }
    GetAuraRadius() {
        return this.radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }

    GetAuraDuration() {
        return 0.1
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.radius = this.GetSpecialValueFor("radius")
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            UTIL_Remove(this.GetParentPlus())
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_FLYING]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
        }
    }


}
