import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
/** dota原技能数据 */
export const Data_axe_culling_blade = { "ID": "5010", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "2", "AbilitySound": "Hero_Axe.Culling_Blade_Success", "AbilityCastPoint": "0.3", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "75.0 65.0 55.0", "AbilityManaCost": "60 120 180", "AbilityCastRange": "150", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "kill_threshold": "250 350 450", "LinkedSpecialBonus": "special_bonus_unique_axe_5" }, "02": { "var_type": "FIELD_INTEGER", "damage": "150 250 300" }, "03": { "var_type": "FIELD_INTEGER", "speed_bonus": "30" }, "04": { "var_type": "FIELD_INTEGER", "atk_speed_bonus": "30" }, "05": { "var_type": "FIELD_FLOAT", "speed_duration": "6" }, "06": { "var_type": "FIELD_INTEGER", "speed_aoe": "900" } } };

@registerAbility()
export class ability6_axe_culling_blade extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "axe_culling_blade";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_axe_culling_blade = Data_axe_culling_blade;
    Init() {
        this.SetDefaultSpecialValue("radius", 800);
        this.SetDefaultSpecialValue("kill_threshold", 300);
        this.SetDefaultSpecialValue("max_health", 130);
        this.SetDefaultSpecialValue("attack_speed", [30, 60, 90, 120, 150, 180]);
        this.SetDefaultSpecialValue("attack_damage", [25, 30, 35, 45, 55, 70]);
        this.SetDefaultSpecialValue("buff_duration", 7);
        this.SetDefaultSpecialValue("damage_factor", [1, 1.1, 1.2, 1.3, 1.4, 1.5]);
        this.SetDefaultSpecialValue("bonus_str", 7);

    }




    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let radius = this.GetSpecialValueFor("radius")
        let buff_duration = this.GetSpecialValueFor("buff_duration")

        let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), radius, null, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER)
        let bSuccess = false
        for (let hTarget of (targets)) {
            if (this.TryKill(hTarget) == true) {
                bSuccess = true
            }
        }
        if (bSuccess) {
            //  所有友方加攻速攻击力
            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Axe.Culling_Blade_Success", hCaster))
            // BuildSystem.EachBuilding(hCaster.GetPlayerOwnerID(), (hBuilding) => {
            //     let hUnit = hBuilding.GetUnitEntity()
            //     if (IsValid(hUnit)) {
            //          modifier_axe_6_attack_buff.apply( hUnit , hCaster, this, { duration = buff_duration })
            //     }
            // })
            this.EndCooldown()
            this.StartCooldown(0.5)
        } else {
            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Axe.Culling_Blade_Fail", hCaster))
        }
    }
    TryKill(hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()

        let kill_threshold = this.GetSpecialValueFor("kill_threshold") + hCaster.GetTalentValue('special_bonus_unique_axe_custom_3')
        let max_health = this.GetSpecialValueFor("max_health")
        let damage_factor = this.GetSpecialValueFor("damage_factor")

        if (hTarget.GetHealth() <= hCaster.GetHealth() * kill_threshold / 100) {
            // if (modifier_undying_zombi_buff.exist(hTarget)) {
            //  modifier_undying_zombi_buff.remove( hTarget );
            // }
            hTarget.Kill(this, hCaster)

            modifier_axe_6_particle_kill.apply(hCaster, hTarget, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
            modifier_axe_6_health_buff.apply(hCaster, hCaster, this, null)
            if (hCaster.HasScepter()) {
                modifier_axe_6_str_buff.apply(hCaster, hCaster, this, null)
            }
            return true
        } else {
            let damage_table = {
                ability: this,
                victim: hTarget,
                attacker: hCaster,
                damage: hCaster.GetMaxHealth() * damage_factor,
                damage_type: this.GetAbilityDamageType(),
            }
            BattleHelper.GoApplyDamage(damage_table)

            modifier_axe_6_particle.apply(hCaster, hTarget, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
        }
        return false
    }
    // GetIntrinsicModifierName() {
    //     return "modifier_axe_6"
    // }




}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_axe_6 extends BaseModifier_Plus {
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
    BeRefresh(params: IModifierTable) {

        if (IsServer()) {
        }
    }
    BeDestroy() {

        if (IsServer()) {
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

            let range = ability.GetSpecialValueFor("radius")
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_axe_6_health_buff// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_axe_6_health_buff extends BaseModifier_Plus {
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
    Init(params: IModifierTable) {
        if (IsServer()) {
            this.changeStackCount(this.GetSpecialValueFor("max_health"))
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierHealthBonus() {
        return this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.GetStackCount()
    }
}

// // // // // // // // // // // // // // // // // // // -modifier_axe_6_str_buff// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_axe_6_str_buff extends BaseModifier_Plus {
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
    Init(params: IModifierTable) {
        if (IsServer()) {
            this.changeStackCount(this.GetSpecialValueFor("bonus_str"))
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength() {
        return this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_axe_6_attack_buff// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_axe_6_attack_buff extends BaseModifier_Plus {
    attack_speed: number;
    attack_damage: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return false
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
        this.attack_speed = this.GetSpecialValueFor("attack_speed")
        this.attack_damage = this.GetSpecialValueFor("attack_damage")
        if (IsServer()) {
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant(params: IModifierTable) {
        return this.attack_speed
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage(params: IModifierTable) {
        return this.attack_damage
    }
}

// 特效
@registerModifier()
export class modifier_axe_6_particle extends modifier_particle {
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_axe/axe_culling_blade.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }
}

// 特效
@registerModifier()
export class modifier_axe_6_particle_kill extends modifier_particle {
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_axe/axe_culling_blade_boost.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(particleID, 1, hCaster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(particleID)

            particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_axe/axe_culling_blade_kill.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(particleID, 3, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(particleID, 4, hCaster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }
}
