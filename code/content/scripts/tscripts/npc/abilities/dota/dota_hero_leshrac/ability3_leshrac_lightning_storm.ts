import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_leshrac_lightning_storm = { "ID": "5243", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_Leshrac.Lightning_Storm", "AbilityCastRange": "650", "AbilityCastPoint": "0.3", "AbilityCooldown": "4", "AbilityManaCost": "80 100 120 140", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "damage": "90 130 170 210", "LinkedSpecialBonus": "special_bonus_unique_leshrac_6" }, "02": { "var_type": "FIELD_INTEGER", "jump_count": "4 6 8 10" }, "03": { "var_type": "FIELD_INTEGER", "radius": "475" }, "04": { "var_type": "FIELD_FLOAT", "jump_delay": "0.25 0.25 0.25 0.25" }, "05": { "var_type": "FIELD_INTEGER", "slow_movement_speed": "-75" }, "06": { "var_type": "FIELD_FLOAT", "slow_duration": "0.4 0.6 0.8 1.0", "LinkedSpecialBonus": "special_bonus_unique_leshrac_3" }, "07": { "var_type": "FIELD_FLOAT", "interval_scepter": "1.5", "RequiresScepter": "1" }, "08": { "var_type": "FIELD_INTEGER", "radius_scepter": "750", "RequiresScepter": "1" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_leshrac_lightning_storm extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "leshrac_lightning_storm";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_leshrac_lightning_storm = Data_leshrac_lightning_storm;
    Init() {
        this.SetDefaultSpecialValue("jump_count", [5, 6, 7, 8, 9, 10]);
        this.SetDefaultSpecialValue("radius", 475);
        this.SetDefaultSpecialValue("jump_delay", 0.25);
        this.SetDefaultSpecialValue("slow_movement_speed", -75);
        this.SetDefaultSpecialValue("slow_duration", [0.5, 0.6, 0.7, 0.8, 0.9, 1.0]);

    }



    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue("special_bonus_unique_leshrac_custom_6")
    }

    Jump(target: IBaseNpc_Plus, units: IBaseNpc_Plus[], count: number) {
        if (!IsValid(target)) { return }
        let caster = this.GetCasterPlus()
        let damage_per_int = caster.GetTalentValue("special_bonus_unique_leshrac_custom_4")
        let damage = this.GetAbilityDamage()
        let radius = this.GetSpecialValueFor("radius")
        let jump_count = this.GetSpecialValueFor("jump_count")
        let jump_delay = this.GetSpecialValueFor("jump_delay")
        let slow_duration = this.GetSpecialValueFor("slow_duration")

        let position = target.GetAbsOrigin()

        this.addTimer(jump_delay, () => {
            let new_target = AoiHelper.GetBounceTarget([target], caster.GetTeamNumber(), radius, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, position, FindOrder.FIND_CLOSEST)
            if (IsValid(new_target)) {
                modifier_leshrac_3_particle.apply(caster, new_target, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
                modifier_leshrac_3_debuff.apply(new_target, caster, this, { duration: slow_duration * new_target.GetStatusResistanceFactor(caster) })
                damage = damage + damage_per_int * caster.GetIntellect()

                EmitSoundOnLocationWithCaster(new_target.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Leshrac.Lightning_Storm", caster), caster)

                if (count < jump_count) {
                    table.insert(units, new_target)
                    this.Jump(new_target, units, count + 1)
                }

                let damage_table =
                {
                    ability: this,
                    attacker: caster,
                    victim: new_target,
                    damage: damage,
                    damage_type: this.GetAbilityDamageType()
                }
                BattleHelper.GoApplyDamage(damage_table)
            }
        })
    }
    OnSpellStart() {
        let caster = this.GetCasterPlus()
        let target = this.GetCursorTarget() as IBaseNpc_Plus
        let damage_per_int = caster.GetTalentValue("special_bonus_unique_leshrac_custom_4")
        let damage = this.GetAbilityDamage()
        let jump_count = this.GetSpecialValueFor("jump_count")
        let jump_delay = this.GetSpecialValueFor("jump_delay")
        let slow_duration = this.GetSpecialValueFor("slow_duration")
        if (!IsValid(target) || !target.IsAlive()) {
            return
        }
        let position = target.GetAbsOrigin()
        if (target.TriggerSpellAbsorb(this)) {
            return
        }

        this.addTimer(jump_delay, () => {
            EmitSoundOnLocationWithCaster(position, ResHelper.GetSoundReplacement("Hero_Leshrac.Lightning_Storm", caster), caster)
            if (1 < jump_count) {
                this.Jump(target, [target], 2)
            }
            if (IsValid(target)) {
                modifier_leshrac_3_particle.apply(caster, target, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
                damage = damage + damage_per_int * caster.GetIntellect()
                let damage_table =
                {
                    ability: this,
                    attacker: caster,
                    victim: target,
                    damage: damage,
                    damage_type: this.GetAbilityDamageType()
                }
                BattleHelper.GoApplyDamage(damage_table)

                modifier_leshrac_3_debuff.apply(target, caster, this, { duration: slow_duration * target.GetStatusResistanceFactor(caster) })
            }
        })
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_leshrac_3"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_leshrac_3 extends BaseModifier_Plus {
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

            //  优先攻击目标
            let target = caster.GetAttackTarget()
            if (target != null && target.GetClassname() == "dota_item_drop") { target = null }
            if (target != null && !target.IsPositionInRange(caster.GetAbsOrigin(), range)) {
                target = null
            }

            //  搜索范围
            if (target == null) {
                let teamFilter = ability.GetAbilityTargetTeam()
                let typeFilter = ability.GetAbilityTargetType()
                let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
                let order = FindOrder.FIND_CLOSEST
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                target = targets[0]
            }

            //  施法命令
            if (target != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                    TargetIndex: target.entindex(),
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }


}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_leshrac_3_debuff extends BaseModifier_Plus {
    slow_movement_speed: number;
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
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_leshrac/leshrac_lightning_slow.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControlEnt(particleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }
    Init(params: IModifierTable) {
        this.slow_movement_speed = this.GetSpecialValueFor("slow_movement_speed")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: IModifierTable) {
        return this.slow_movement_speed
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_leshrac_3_particle extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetParentPlus()
        let hParent = this.GetCasterPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_leshrac/leshrac_lightning_bolt.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(particleID, 0, (hParent.GetAbsOrigin() + Vector(0, 0, 1000)) as Vector)
            ParticleManager.SetParticleControlEnt(particleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }
}