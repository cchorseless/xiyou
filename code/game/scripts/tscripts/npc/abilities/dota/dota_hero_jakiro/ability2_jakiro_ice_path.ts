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

/** dota原技能数据 */
export const Data_jakiro_ice_path = { "ID": "5298", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "FightRecapLevel": "1", "AbilitySound": "Hero_Jakiro.IcePath", "AbilityCastRange": "1200", "AbilityCastPoint": "0.65", "AbilityCooldown": "12.0 11.0 10.0 9.0", "AbilityDamage": "0", "AbilityManaCost": "100", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "path_delay": "0.5" }, "02": { "var_type": "FIELD_FLOAT", "duration": "1 1.5 2.0 2.5", "LinkedSpecialBonus": "special_bonus_unique_jakiro" }, "03": { "var_type": "FIELD_INTEGER", "path_radius": "150" }, "04": { "var_type": "FIELD_INTEGER", "damage": "50" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_jakiro_ice_path extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "jakiro_ice_path";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_jakiro_ice_path = Data_jakiro_ice_path;
    Init() {
        this.SetDefaultSpecialValue("path_delay", 0.5);
        this.SetDefaultSpecialValue("duration", [1, 1.2, 1.5, 1.8, 2.4, 3]);
        this.SetDefaultSpecialValue("path_radius", 150);
        this.SetDefaultSpecialValue("damage_max_mana_factor", 2);

    }



    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vStartPosition = hCaster.GetAbsOrigin()
        let vTargetPosition = this.GetCursorPosition()
        let duration = this.GetSpecialValueFor("duration")
        let path_delay = this.GetSpecialValueFor("path_delay")
        let path_radius = this.GetSpecialValueFor("path_radius")
        let damage_max_mana_factor = this.GetSpecialValueFor("damage_max_mana_factor")
        let fissure_range = this.GetCastRange(hCaster.GetAbsOrigin(), null) + hCaster.GetCastRangeBonus()
        let distance_between_blocker = 24
        let blocker_collision = 24
        let vDirection = (vTargetPosition - vStartPosition) as Vector
        vDirection.z = 0
        vStartPosition = GetGroundPosition((vStartPosition + vDirection.Normalized() * distance_between_blocker * 2) as Vector, hCaster)
        vTargetPosition = GetGroundPosition((vStartPosition + vDirection.Normalized() * (fissure_range - distance_between_blocker * 2) as Vector), hCaster)
        modifier_jakiro_2_thinker.applyThinker(((vStartPosition + vTargetPosition) / 2) as Vector, hCaster, this, {
            duration: duration,
            vStartPosition: GameFunc.VectorFunctions.VectorToString(vStartPosition),
            vTargetPosition: GameFunc.VectorFunctions.VectorToString(vTargetPosition),
        }, hCaster.GetTeamNumber(), false)
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Jakiro.IcePath.Cast", hCaster))
        EmitSoundOnLocationWithCaster(((vStartPosition + vTargetPosition) / 2) as Vector, ResHelper.GetSoundReplacement("Hero_Jakiro.IcePath", hCaster), hCaster)
        hCaster.addTimer(path_delay, () => {
            let tTargets = FindUnitsInLine(hCaster.GetTeamNumber(), vStartPosition, vTargetPosition, null, path_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE)
            for (let hTarget of (tTargets)) {
                let fDamage = hCaster.GetMaxMana() * damage_max_mana_factor
                let damage_table =
                {
                    ability: this,
                    attacker: hCaster,
                    victim: hTarget,
                    damage: fDamage,
                    damage_type: this.GetAbilityDamageType()
                }
                BattleHelper.GoApplyDamage(damage_table)
            }
        })
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_jakiro_2"
    // }

}
// // // // // // // // // // // // // // // // // // // -Modifiers// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_jakiro_2 extends BaseModifier_Plus {
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

            let hCaster = ability.GetCasterPlus()

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

            let range = ability.GetCastRange(hCaster.GetAbsOrigin(), hCaster) + hCaster.GetCastRangeBonus()
            let start_width = ability.GetSpecialValueFor("path_radius")
            let end_width = ability.GetSpecialValueFor("path_radius")

            let position = AoiHelper.GetLinearMostTargetsPosition(hCaster.GetAbsOrigin(), range, hCaster.GetTeamNumber(), start_width, end_width, null, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_CLOSEST)

            if (position != vec3_invalid && hCaster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: position
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_jakiro_2_thinker extends BaseModifier_Plus {
    path_range: any;
    path_radius: number;
    path_delay: number;
    duration: number;
    vStartPosition: Vector;
    vTargetPosition: Vector;
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
        return this.GetStackCount() == 1
    }
    GetAuraRadius() {
        return this.path_range
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE
    }
    GetAura() {
        return "modifier_jakiro_2_root"
    }
    GetAuraEntityReject(hTarget: BaseNpc_Plus) {
        if (CalcDistanceToLineSegment2D(hTarget.GetAbsOrigin(), this.vStartPosition, this.vTargetPosition) <= this.path_radius + hTarget.GetHullRadius()) {
            return false
        }
        return true
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.path_radius = this.GetSpecialValueFor("path_radius")
        this.path_delay = this.GetSpecialValueFor("path_delay")
        this.duration = this.GetSpecialValueFor("duration")
        this.path_range = this.GetAbilityPlus().GetCastRange(hCaster.GetAbsOrigin(), null) + hCaster.GetCastRangeBonus()

        if (IsServer()) {
            this.vStartPosition = GameFunc.VectorFunctions.StringToVector(params.vStartPosition)
            this.vTargetPosition = GameFunc.VectorFunctions.StringToVector(params.vTargetPosition)
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_jakiro/jakiro_ice_path.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, this.vStartPosition)
            ParticleManager.SetParticleControl(iParticleID, 1, this.vTargetPosition)
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(0, 0, this.path_delay))
            ParticleManager.ReleaseParticleIndex(iParticleID)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_jakiro/jakiro_ice_path_b.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, this.vStartPosition)
            ParticleManager.SetParticleControl(iParticleID, 1, this.vTargetPosition)
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(this.path_delay + this.duration, 0, 0))
            ParticleManager.SetParticleControl(iParticleID, 9, this.vStartPosition)
            ParticleManager.SetParticleControlEnt(iParticleID, 9, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.vStartPosition, true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
            this.StartIntervalThink(this.path_delay)
        }
    }
    OnIntervalThink() {
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            this.SetStackCount(1)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        let hParent = this.GetParentPlus()
        let hCaster = this.GetCasterPlus()
        if (IsServer()) {
            if (GameFunc.IsValid(hParent)) {
                UTIL_Remove(hParent)
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_jakiro_2_root extends BaseModifier_Plus {
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
        return "particles/units/heroes/hero_jakiro/jakiro_icepath_debuff.vpcf"
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/generic_gameplay/generic_stunned.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, false, -1, false, true)
        }
    }


    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_FROZEN]: true,
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_MAGICAL_DAMAGE_PERCENTAGE)
    EOM_GetModifierIncomingMagicalDamagePercentage() {
        if (GameFunc.IsValid(this.GetCasterPlus())) {
            return this.GetCasterPlus().GetTalentValue("special_bonus_unique_jakiro_custom_7")
        }
    }
}
