
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_crystal_maiden_crystal_nova = { "ID": "5126", "AbilityType": "DOTA_ABILITY_TYPE_BASIC", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_Crystal.CrystalNova", "AbilityCastRange": "700", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "11 10 9 8", "AbilityManaCost": "130 145 160 175", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "425" }, "02": { "var_type": "FIELD_INTEGER", "movespeed_slow": "-20 -30 -40 -50" }, "03": { "var_type": "FIELD_INTEGER", "attackspeed_slow": "-20 -30 -40 -50" }, "04": { "var_type": "FIELD_FLOAT", "duration": "4.5" }, "05": { "var_type": "FIELD_FLOAT", "vision_duration": "6.0" }, "06": { "var_type": "FIELD_INTEGER", "nova_damage": "130 170 210 260", "LinkedSpecialBonus": "special_bonus_unique_crystal_maiden_2" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_crystal_maiden_crystal_nova extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "crystal_maiden_crystal_nova";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_crystal_maiden_crystal_nova = Data_crystal_maiden_crystal_nova;
    Init() {
        this.SetDefaultSpecialValue("radius", 425);
        this.SetDefaultSpecialValue("movespeed_slow", -40);
        this.SetDefaultSpecialValue("duration", 4);
        this.SetDefaultSpecialValue("damage", [100, 200, 400, 800, 1600, 3200]);
        this.SetDefaultSpecialValue("intellect_factor", [2, 3, 4, 5, 6, 7]);
    }

    GetAOERadius() {
        return this.GetSpecialValueFor("radius") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_crystal_maiden_custom_1")
    }
    GetBehavior() {
        if (IsServer()) {
            return this.GetCasterPlus().IsChanneling() &&
                DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT +
                DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST +
                DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE +
                DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL ||
                DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT +
                DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST
        }
        return tonumber(tostring(super.GetBehavior()));
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let duration = this.GetSpecialValueFor("duration")
        let radius = this.GetSpecialValueFor("radius") + hCaster.GetTalentValue("special_bonus_unique_crystal_maiden_custom_1")
        let damage = this.GetSpecialValueFor("damage")
        let intellect_factor = this.GetSpecialValueFor("intellect_factor")
        modifier_crystal_maiden_1_particle.applyThinker(vPosition, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION }, hCaster.GetTeamNumber(), false)
        let iInt = hCaster.GetIntellect != null && hCaster.GetIntellect() || 0
        let fDamage = damage + intellect_factor * iInt
        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vPosition, radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
        for (let hTarget of (tTargets)) {
            modifier_crystal_maiden_1_slow.apply(hTarget, hCaster, this, { duration: duration })
            BattleHelper.GoApplyDamage({
                ability: this,
                attacker: hCaster,
                victim: hTarget,
                damage: fDamage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            })
        }

        EmitSoundOnLocationWithCaster(vPosition, "Hero_Crystal.CrystalNova", hCaster)
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_crystal_maiden_1"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_crystal_maiden_1 extends BaseModifier_Plus {
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

            let position = AoiHelper.GetAOEMostTargetsPosition(caster.GetAbsOrigin(), range, caster.GetTeamNumber(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_CLOSEST)

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
export class modifier_crystal_maiden_1_slow extends BaseModifier_Plus {
    movespeed_slow: number;
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
    Init(params: IModifierTable) {
        this.movespeed_slow = this.GetSpecialValueFor("movespeed_slow")
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: IModifierTable) {
        return this.movespeed_slow
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_crystal_maiden_1_particle extends modifier_particle_thinker {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsClient()) {
            let radius = this.GetSpecialValueFor("radius") + hCaster.GetTalentValue("special_bonus_unique_crystal_maiden_custom_1")
            GLogHelper.print(radius);
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_crystalmaiden/maiden_crystal_nova.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: hCaster
            });
            ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(radius, 2, 1000))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
