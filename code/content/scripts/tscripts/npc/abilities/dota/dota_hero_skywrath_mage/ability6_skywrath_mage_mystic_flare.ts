

import { GameEnum } from "../../../../shared/GameEnum";
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
export const Data_skywrath_mage_mystic_flare = { "ID": "5584", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "2", "HasScepterUpgrade": "1", "AbilityCastRange": "1200", "AbilityCastPoint": "0.1 0.1 0.1 0.1", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "60.0 40.0 20.0", "AbilityManaCost": "300 550 800", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "170" }, "02": { "var_type": "FIELD_FLOAT", "duration": "2.4" }, "03": { "var_type": "FIELD_INTEGER", "damage": "750 1175 1600", "LinkedSpecialBonus": "special_bonus_unique_skywrath_5" }, "04": { "var_type": "FIELD_FLOAT", "damage_interval": "0.1" }, "05": { "var_type": "FIELD_INTEGER", "scepter_radius": "700", "RequiresScepter": "1" } } };

@registerAbility()
export class ability6_skywrath_mage_mystic_flare extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "skywrath_mage_mystic_flare";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_skywrath_mage_mystic_flare = Data_skywrath_mage_mystic_flare;
    Init() {
        this.SetDefaultSpecialValue("radius", 170);
        this.SetDefaultSpecialValue("duration", 2.4);
        this.SetDefaultSpecialValue("damage", [750, 1500, 2250, 3000, 3750, 4500]);
        this.SetDefaultSpecialValue("int_multiplier", [10, 12, 14, 16, 18, 20]);
        this.SetDefaultSpecialValue("damage_interval", 0.2);
        this.SetDefaultSpecialValue("scepter_radius", 700);

    }

    Init_old() {
        this.SetDefaultSpecialValue("radius", 170);
        this.SetDefaultSpecialValue("duration", 2.4);
        this.SetDefaultSpecialValue("damage", [750, 1500, 2250, 3000, 3750, 4500]);
        this.SetDefaultSpecialValue("int_multiplier", [10, 11, 12, 13, 14, 15]);
        this.SetDefaultSpecialValue("damage_interval", 0.1);
        this.SetDefaultSpecialValue("scepter_radius", 700);

    }



    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    MysticFlare(vTargetPosition: Vector) {
        let hCaster = this.GetCasterPlus()
        let radius = this.GetSpecialValueFor("radius")
        let duration = this.GetSpecialValueFor("duration")
        let damage = this.GetSpecialValueFor("damage")
        let int_multiplier = this.GetSpecialValueFor("int_multiplier")
        let damage_interval = this.GetSpecialValueFor("damage_interval")
        let share_damage = hCaster.HasTalent("special_bonus_unique_skywrath_mage_custom_4") && 1 || null
        this.addTimer(0, () => {
            if (duration > 0) {
                duration = duration - damage_interval
                let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vTargetPosition, radius, null, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST)
                for (let hTarget of (tTargets)) {
                    let damage_table = {
                        ability: this,
                        victim: hTarget,
                        attacker: hCaster,
                        damage: (damage + int_multiplier * hCaster.GetIntellect()) * damage_interval / (share_damage || tTargets.length),
                        damage_type: this.GetAbilityDamageType(),
                    }
                    BattleHelper.GoApplyDamage(damage_table)
                }
                hCaster.EmitSound("Hero_SkywrathMage.MysticFlare.Target")
                return damage_interval
            }
        })
        //  particle
        modifier_skywrath_mage_6_particle.applyThinker(vTargetPosition, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION }, hCaster.GetTeamNumber(), false)
        //  sound
        hCaster.EmitSound("Hero_SkywrathMage.MysticFlare.Cast")
        EmitSoundOnLocationForAllies(vTargetPosition, ResHelper.GetSoundReplacement("Hero_SkywrathMage.MysticFlare", hCaster), hCaster)
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vTargetPosition = this.GetCursorPosition()
        this.MysticFlare(vTargetPosition)
        if (hCaster.HasScepter()) {
            let scepter_radius = this.GetSpecialValueFor("scepter_radius")
            let radius = this.GetSpecialValueFor("radius")
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), scepter_radius, null, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST)
            let extra_count = 1 + hCaster.GetTalentValue("special_bonus_unique_skywrath_mage_custom_7")
            for (let hUnit of (tTargets)) {
                extra_count -= 1;
                if (0 > extra_count) {
                    break
                }
                this.MysticFlare((hUnit.GetAbsOrigin() + RandomVector(1) * RandomFloat(0, radius / 2)) as Vector)
            }
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_skywrath_mage_6"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_skywrath_mage_6 extends BaseModifier_Plus {
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
    OnRefresh(params: ModifierTable) {
        super.OnRefresh(params);
        if (IsServer()) {
            if (params.bonus_damage != null) {
                this.SetStackCount(this.GetStackCount() + params.bonus_damage)
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
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage() {
        return this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_skywrath_mage_6_particle extends modifier_particle_thinker {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsClient()) {
            let radius = this.GetSpecialValueFor("radius")
            let duration = this.GetSpecialValueFor("duration")
            let damage_interval = this.GetSpecialValueFor("damage_interval")
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_skywrath_mage/skywrath_mage_mystic_flare_ambient.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(radius, duration, damage_interval))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }


}
