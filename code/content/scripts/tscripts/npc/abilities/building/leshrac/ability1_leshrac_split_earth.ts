import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_generic_stunned } from "../../../modifier/effect/modifier_generic_stunned";
import { unit_dummy } from "../../../units/common/unit_dummy";

/** dota原技能数据 */
export const Data_leshrac_split_earth = { "ID": "5241", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "FightRecapLevel": "1", "AbilitySound": "Hero_Leshrac.Split_Earth", "HasShardUpgrade": "1", "AbilityCastRange": "650", "AbilityCastPoint": "0.7 0.7 0.7 0.7", "AbilityCooldown": "9 9 9 9", "AbilityManaCost": "80 100 120 140", "AbilityDamage": "120 180 240 300", "AbilityDuration": "2", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "delay": "0.35" }, "02": { "var_type": "FIELD_INTEGER", "radius": "150 175 200 225", "LinkedSpecialBonus": "special_bonus_unique_leshrac_5" }, "03": { "var_type": "FIELD_FLOAT", "duration": "2" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_leshrac_split_earth extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "leshrac_split_earth";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_leshrac_split_earth = Data_leshrac_split_earth;
    Init() {
        this.SetDefaultSpecialValue("delay", 0.35);
        this.SetDefaultSpecialValue("radius", [300, 350, 400, 450, 500, 600]);
        this.SetDefaultSpecialValue("duration", [1, 1.2, 1.4, 1.6, 1.8, 2.0]);

    }

    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let caster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let delay = this.GetSpecialValueFor("delay")

        modifier_leshrac_1_thinker.applyThinker(vPosition, caster, this, { duration: delay }, caster.GetTeamNumber(), false)
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_leshrac_1"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_leshrac_1 extends BaseModifier_Plus {
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
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }


    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (!IsValid(ability)) {
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

            let position = AoiHelper.GetAOEMostTargetsPosition(caster.GetAbsOrigin(),
                range,
                caster.GetTeamNumber(),
                radius,
                null,
                ability.GetAbilityTargetTeam(),
                ability.GetAbilityTargetType(),
                ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS,
                FindOrder.FIND_CLOSEST)

            //  施法命令
            if (position && position != vec3_invalid && caster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: position,
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_leshrac_1_thinker extends BaseModifier_Plus {
    duration: number;
    radius: number;
    damage: number;
    damage_type: DAMAGE_TYPES;
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

        this.duration = this.GetSpecialValueFor("duration")
        this.radius = this.GetSpecialValueFor("radius")
        if (IsServer()) {
            this.damage = this.GetAbilityPlus().GetAbilityDamage()
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType()
        }
    }
    BeRemoved(): void {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsServer()) {
            let vPosition = hParent.GetAbsOrigin()
            UTIL_Remove(hParent)
            if (!IsValid(hCaster) || !IsValid(hAbility)) {
                return
            }
            let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vPosition, this.radius, null, hAbility.GetAbilityTargetTeam(), hAbility.GetAbilityTargetType(), hAbility.GetAbilityTargetFlags(), 0)
            for (let target of (targets)) {
                modifier_generic_stunned.apply(target, hCaster, hAbility, { duration: this.duration * target.GetStatusResistanceFactor(hCaster) })
                if (hCaster.HasTalent("special_bonus_unique_leshrac_custom_3")) {
                    modifier_leshrac_1_debuff.apply(target, hCaster, hAbility, { duration: this.duration * target.GetStatusResistanceFactor(hCaster) })
                }
                let damage_table = {
                    ability: hAbility,
                    victim: target,
                    attacker: hCaster,
                    damage: this.damage,
                    damage_type: this.damage_type,
                }
                BattleHelper.GoApplyDamage(damage_table)
            }

            EmitSoundOnLocationWithCaster(vPosition, ResHelper.GetSoundReplacement("Hero_Leshrac.Split_Earth", hCaster), hCaster)

            if (hCaster.HasTalent("special_bonus_unique_leshrac_custom")) {
                let duration = hCaster.GetTalentValue("special_bonus_unique_leshrac_custom")
                let hThinker = unit_dummy.CreateOne(vPosition, hCaster.GetTeamNumber(), false, hCaster, hCaster)
                modifier_leshrac_1_field.apply(hThinker, hThinker, hAbility, { duration: duration })
            }
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_leshrac/leshrac_split_earth.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.radius, this.radius, this.radius))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_leshrac_1_debuff extends BaseModifier_Plus {
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
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_BONUS)
    G_MAGICAL_ARMOR_BONUS() {
        return this.GetCasterPlus().GetTalentValue("special_bonus_unique_leshrac_custom_3")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_tooltip() {
        if (IsValid(this.GetCasterPlus())) {
            return this.GetCasterPlus().GetTalentValue("special_bonus_unique_leshrac_custom_3")
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_leshrac_1_field extends BaseModifier_Plus {
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
        return "modifier_leshrac_1_field_aura"
    }
    GetAuraRadius() {
        return this.radius + 68
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
    BeCreated(params: IModifierTable) {

        this.radius = this.GetSpecialValueFor("radius") + 25
        let hParent = this.GetParentPlus()
        let hCaster = this.GetAbilityPlus().GetCasterPlus()
        if (IsServer()) {
            hParent.SetDayTimeVisionRange(this.radius)
            hParent.SetNightTimeVisionRange(this.radius)
        } else {
            let sParticelPath = ResHelper.GetParticleReplacement("particles/units/heroes/hero_leshrac/leshrac_split_earth.vpcf", hCaster)
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/dev/new_heroes/new_hero_aoe_ring.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.radius, this.radius, this.radius))
            if (sParticelPath == "particles/units/heroes/hero_leshrac/leshrac_split_earth.vpcf") {
                ParticleManager.SetParticleControl(iParticleID, 15, Vector(250, 92, 92))
            } else if (sParticelPath == "particles/econ/items/leshrac/leshrac_tormented_staff/leshrac_split_tormented.vpcf") {
                ParticleManager.SetParticleControl(iParticleID, 15, Vector(220, 161, 255))
            } else if (sParticelPath == "particles/econ/items/leshrac/leshrac_tormented_staff_retro/leshrac_split_retro_tormented.vpcf") {
                ParticleManager.SetParticleControl(iParticleID, 15, Vector(143, 255, 74))
            }
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    BeDestroy() {

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
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_leshrac_1_field_aura extends BaseModifier_Plus {
    vPosition: Vector;
    radius: number;
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
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    BeCreated(params: IModifierTable) {

        this.radius = this.GetSpecialValueFor("radius") + 25
        if (IsServer()) {
            this.vPosition = this.GetCasterPlus().GetAbsOrigin()
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_disruptor_kinetic_fieldslow.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, true, 10, false, false)
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT)
    GetMoveSpeed_Limit(params: IModifierTable) {
        if (IsServer()) {
            if (IsValid(this.GetParentPlus())) {
                let vDirection = (this.vPosition - this.GetParentPlus().GetAbsOrigin()) as Vector
                vDirection.z = 0
                let fToPositionDistance = vDirection.Length2D()
                let fToRingDistance = math.abs(this.radius - fToPositionDistance)
                let vForward = this.GetParentPlus().GetForwardVector()
                let fCosValue = (vDirection.x * vForward.x + vDirection.y * vForward.y) / (vForward.Length2D() * fToPositionDistance)
                if (fToRingDistance <= 32 && ((fToPositionDistance > this.radius && fCosValue > 0) || (fToPositionDistance <= this.radius && fCosValue <= 0))) {
                    return RemapValClamped(fToRingDistance, this.radius, 0, 550, 0.00001)
                }
            }
        }
    }
}
