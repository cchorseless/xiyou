import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
/** dota原技能数据 */
export const Data_puck_dream_coil = { "ID": "5073", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_POINT", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "2", "HasScepterUpgrade": "1", "AbilitySound": "Hero_Puck.Dream_Coil", "AbilityCastRange": "750", "AbilityCastPoint": "0.1 0.1 0.1", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_5", "AbilityCooldown": "80", "AbilityManaCost": "100 150 200", "AbilityModifierSupportValue": "0.5", "AbilitySpecial": { "10": { "var_type": "FIELD_FLOAT", "coil_stun_duration_scepter": "2 3 4", "RequiresScepter": "1" }, "01": { "var_type": "FIELD_FLOAT", "coil_duration": "6.0 6.0 6.0" }, "02": { "var_type": "FIELD_INTEGER", "coil_break_radius": "600 600 600" }, "03": { "var_type": "FIELD_FLOAT", "stun_duration": "0.5" }, "04": { "var_type": "FIELD_INTEGER", "coil_initial_damage": "125 200 275" }, "05": { "var_type": "FIELD_FLOAT", "coil_stun_duration": "1.8 2.4 3.0" }, "06": { "var_type": "FIELD_INTEGER", "coil_break_damage": "200 300 400" }, "07": { "var_type": "FIELD_INTEGER", "coil_radius": "375 375 375" }, "08": { "var_type": "FIELD_FLOAT", "coil_duration_scepter": "8", "RequiresScepter": "1" }, "09": { "var_type": "FIELD_INTEGER", "coil_break_damage_scepter": "300 450 600", "RequiresScepter": "1" } } };

@registerAbility()
export class ability6_puck_dream_coil extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "puck_dream_coil";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_puck_dream_coil = Data_puck_dream_coil;
    Init() {
        this.SetDefaultSpecialValue("coil_duration", 6);
        this.SetDefaultSpecialValue("coil_break_radius", 500);
        this.SetDefaultSpecialValue("stun_duration", 1);
        this.SetDefaultSpecialValue("coil_initial_damage", [500, 800, 1300, 2000, 3000, 4500]);
        this.SetDefaultSpecialValue("coil_initial_damage_factor", 0);
        this.SetDefaultSpecialValue("coil_stun_incoming_damage", [20, 22, 24, 26, 28, 30]);
        this.SetDefaultSpecialValue("coil_break_damage", 0);
        this.SetDefaultSpecialValue("coil_radius", 480);

    }



    GetAOERadius() {
        return this.GetSpecialValueFor("coil_radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()

        let coil_duration = this.GetSpecialValueFor("coil_duration")
        let stun_duration = this.GetSpecialValueFor("stun_duration")
        let coil_initial_damage = this.GetSpecialValueFor("coil_initial_damage")
        let coil_initial_damage_factor = this.GetSpecialValueFor("coil_initial_damage_factor")
        let coil_radius = this.GetSpecialValueFor("coil_radius")

        modifier_puck_6_thinker.applyThinker(vPosition, hCaster, this, { duration: coil_duration }, hCaster.GetTeamNumber(), false)

        let iInt = type(hCaster.GetIntellect) == "function" && hCaster.GetIntellect() || 0
        let fDamage = coil_initial_damage + iInt * coil_initial_damage_factor

        let tTargets = FindUnitsInRadius(hCaster.GetTeamNumber(), vPosition, null, coil_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, 0, false)
        for (let hTarget of (tTargets as BaseNpc_Plus[])) {


            modifier_puck_6_coiled.apply(hTarget, hCaster, this, { duration: coil_duration, position: vPosition })

            modifier_stunned.apply(hTarget, hCaster, this, { duration: stun_duration * hTarget.GetStatusResistanceFactor(hCaster) })

            if (fDamage > 0) {
                BattleHelper.GoApplyDamage({
                    ability: this,
                    attacker: hCaster,
                    victim: hTarget,
                    damage: fDamage,
                    damage_type: this.GetAbilityDamageType(),
                })
            }
        }

        EmitSoundOnLocationWithCaster(vPosition, ResHelper.GetSoundReplacement("Hero_Puck.Dream_Coil", hCaster), hCaster)
    }

    GetIntrinsicModifierName() {
        return "modifier_puck_6"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_puck_6 extends BaseModifier_Plus {
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
            if (!GameFunc.IsValid(ability)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let caster = ability.GetCasterPlus()

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

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()
            let radius = ability.GetAOERadius()

            let position = AoiHelper.GetAOEMostTargetsPosition(caster.GetAbsOrigin(), range, caster.GetTeamNumber(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_CLOSEST)

            //  施法命令
            if (position && position != vec3_invalid && caster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: position
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_puck_6_thinker extends BaseModifier_Plus {
    coil_break_radius: number;
    attack_time: number;
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
    GetEffectName() {
        return ResHelper.GetParticleReplacement("particles/units/heroes/hero_puck/puck_dreamcoil.vpcf", this.GetCasterPlus())
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        this.attack_time = 5 /** GetAbilityNameLevelSpecialValueFor("special_bonus_unique_puck_custom_8", "value", 0)*/
        this.coil_break_radius = this.GetSpecialValueFor("coil_break_radius")
        if (IsServer()) {
            this.StartIntervalThink(this.attack_time)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            if (hCaster.HasTalent("special_bonus_unique_puck_custom_8")) {
                if (hCaster.IsPositionInRange(hParent.GetAbsOrigin(), this.coil_break_radius + 200)) {
                    let tTargets = FindUnitsInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), null, this.coil_break_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_CLOSEST, false)
                    for (let hTarget of (tTargets as BaseNpc_Plus[])) {
                        if (modifier_puck_6_coiled.exist(hTarget)) {
                            BattleHelper.Attack(hCaster, hTarget, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK)
                        }
                    }
                }
            }
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
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_puck_6_coiled extends BaseModifier_Plus {
    coil_break_radius: number;
    coil_incoming_damage: number;
    coil_stun_duration: number;
    coil_break_damage: number;
    coil_break_damage_factor: number;
    vPosition: Vector;
    damage_type: DAMAGE_TYPES;
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
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.coil_break_radius = this.GetSpecialValueFor("coil_break_radius")
        this.coil_incoming_damage = this.GetSpecialValueFor("coil_incoming_damage")
        this.coil_stun_duration = this.GetSpecialValueFor("coil_stun_duration")
        this.coil_break_damage = this.GetSpecialValueFor("coil_break_damage")
        this.coil_break_damage_factor = this.GetSpecialValueFor("coil_break_damage_factor")
        if (IsServer()) {
            this.vPosition = GameFunc.VectorFunctions.StringToVector(params.position)
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType()
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_puck/puck_dreamcoil_tether.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, this.vPosition)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)

            this.StartIntervalThink(0)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            if (!GameFunc.IsValid(hCaster)) {
                this.Destroy()
                return
            }
            if (hParent.IsMagicImmune()) {
                this.Destroy()
                return
            }

            if (!hParent.IsPositionInRange(this.vPosition, this.coil_break_radius)) {
                let iInt = type(hCaster.GetIntellect) == "function" && hCaster.GetIntellect() || 0
                let fDamage = this.coil_break_damage + iInt * this.coil_break_damage_factor

                modifier_puck_6_debuff.apply(hParent, hCaster, hAbility, { duration: this.coil_stun_duration })

                BattleHelper.GoApplyDamage({
                    ability: hAbility,
                    attacker: hCaster,
                    victim: hParent,
                    damage: fDamage,
                    damage_type: this.damage_type
                })

                EmitSoundOnLocationWithCaster(hParent.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Puck.Dream_Coil_Snap", hCaster), hCaster)

                this.Destroy()
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_TETHERED]: true,
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    EOM_GetModifierIncomingDamagePercentage(params: ModifierTable) {
        if (params.attacker == this.GetCasterPlus()) {
            return this.coil_incoming_damage
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_puck_6_debuff extends BaseModifier_Plus {
    coil_stun_incoming_damage: number;
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
        return true
    }
    IsStunDebuff() {
        return true
    }
    AllowIllusionDuplicate() {
        return false
    }
    GetEffectName() {
        return "particles/generic_gameplay/generic_stunned.vpcf"
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW
    }
    Init(params: ModifierTable) {
        this.coil_stun_incoming_damage = this.GetSpecialValueFor("coil_stun_incoming_damage")
    }

    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_DISABLED
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    g_INCOMING_DAMAGE_PERCENTAGE() {
        return this.coil_stun_incoming_damage
    }
}
