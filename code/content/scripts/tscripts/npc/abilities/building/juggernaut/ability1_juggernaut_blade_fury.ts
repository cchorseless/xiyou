
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { ActiveRootAbility } from "../../ActiveRootAbility";

/** dota原技能数据 */
export const Data_juggernaut_blade_fury = { "ID": "5028", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "1", "HasShardUpgrade": "1", "AbilityCastRange": "0", "AbilityCastPoint": "0 0 0 0", "AbilityCooldown": "42 34 26 18", "AbilityManaCost": "120 110 100 90", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "blade_fury_damage_tick": "0.2", "CalculateSpellDamageTooltip": "0" }, "02": { "var_type": "FIELD_INTEGER", "blade_fury_radius": "260" }, "03": { "var_type": "FIELD_INTEGER", "blade_fury_damage": "85 110 135 160", "LinkedSpecialBonus": "special_bonus_unique_juggernaut_3" }, "04": { "var_type": "FIELD_FLOAT", "duration": "5.0", "LinkedSpecialBonus": "special_bonus_unique_juggernaut" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_juggernaut_blade_fury extends ActiveRootAbility {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "juggernaut_blade_fury";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_juggernaut_blade_fury = Data_juggernaut_blade_fury;
    Init() {
        this.SetDefaultSpecialValue("blade_fury_damage_tick", 0.2);
        this.SetDefaultSpecialValue("blade_fury_radius", 700);
        this.SetDefaultSpecialValue("blade_fury_damage", [200, 400, 700, 1000, 1500, 2000]);
        this.SetDefaultSpecialValue("duration", 6);
        this.SetDefaultSpecialValue("bonus_attack_speed", [55, 60, 65, 70, 75, 80]);
        this.SetDefaultSpecialValue("interval", 1);
        this.SetDefaultSpecialValue("status_resistance", 50);
        this.SetDefaultSpecialValue("attack_interval", 0.5);
        this.SetDefaultSpecialValue("attack_damage_pct", 200);

    }



    OnSpellStart() {
        let caster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration")

        caster.Purge(false, true, false, false, false)
        modifier_juggernaut_1_buff.apply(caster, caster, this, { duration: duration })
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_juggernaut_1"
    // }
    GetCastRange() {
        return this.GetSpecialValueFor("blade_fury_radius")
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_juggernaut_1 extends BaseModifier_Plus {
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
            if (!GFuncEntity.IsValid(ability)) {
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

            let range = caster.Script_GetAttackRange()
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE
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
export class modifier_juggernaut_1_buff extends BaseModifier_Plus {
    blade_fury_radius: number;
    bonus_attack_speed: number;
    interval: number;
    status_resistance: number;
    blade_fury_damage_tick: number;
    attack_interval: number;
    fInterval: number;
    fAttackInterval: number;
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
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            hParent.EmitSound(ResHelper.GetSoundReplacement("Hero_Juggernaut.BladeFuryStart", hCaster))
            this.fInterval = GameRules.GetGameTime() + this.interval
            this.fAttackInterval = GameRules.GetGameTime() + this.attack_interval
            this.StartIntervalThink(this.blade_fury_damage_tick)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_juggernaut/juggernaut_blade_fury.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            ParticleManager.SetParticleControl(iParticleID, 5, Vector(this.blade_fury_radius, 1, 1))
            this.AddParticle(iParticleID, false, false, -1, false, false)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_juggernaut/juggernaut_blade_fury_null.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    Init(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.blade_fury_radius = this.GetSpecialValueFor("blade_fury_radius")
        this.bonus_attack_speed = this.GetSpecialValueFor("bonus_attack_speed")
        this.blade_fury_damage_tick = this.GetSpecialValueFor("blade_fury_damage_tick")
        this.interval = this.GetSpecialValueFor("interval")
        this.status_resistance = this.GetSpecialValueFor("status_resistance")
        this.attack_interval = this.GetSpecialValueFor("attack_interval")
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()

            if (!GFuncEntity.IsValid(hAbility) || !GFuncEntity.IsValid(hCaster)) {
                this.Destroy()
                return
            }

            let radius = this.blade_fury_radius

            let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0)
            for (let target of (targets)) {

                modifier_juggernaut_1_damage.apply(target, hCaster, hAbility, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
            }
            if (GameRules.GetGameTime() >= this.fInterval) {
                hParent.Purge(false, true, false, true, true)
                this.fInterval = GameRules.GetGameTime() + this.interval
            }
            // 魔晶剑刃风暴每0.5秒对周围单位造成一次200%的攻击伤害
            if (GameRules.GetGameTime() >= this.fAttackInterval && hCaster.HasShard()) {
                let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0)
                for (let target of (targets)) {
                    modifier_juggernaut_1_shard_attack_damage.apply(hParent, hParent, this.GetAbilityPlus(), null)
                    BattleHelper.Attack(hParent, target, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NEVERMISS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)
                    modifier_juggernaut_1_shard_attack_damage.remove(hParent);
                }
                this.fAttackInterval = GameRules.GetGameTime() + this.attack_interval
            }
        }
    }
    BeDestroy() {

        if (IsServer()) {
            this.GetParentPlus().StopSound(ResHelper.GetSoundReplacement("Hero_Juggernaut.BladeFuryStart", this.GetCasterPlus()))
            this.GetParentPlus().EmitSound(ResHelper.GetSoundReplacement("Hero_Juggernaut.BladeFuryStop", this.GetCasterPlus()))
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    G_STATUS_RESISTANCE_STACKING() {
        return this.status_resistance
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)
    G_MAX_ATTACKSPEED_BONUS() {
        return this.GetCasterPlus().GetTalentValue("special_bonus_unique_juggernaut_custom_2")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant() {
        return this.bonus_attack_speed
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_1
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE_ILLUSION)
    GetDamageOutgoing_Percentage_Illusion(params: IModifierTable) {
        if (params.target && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, this.GetParentPlus().GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
            //  return -100
        }
        return 0
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_juggernaut_1_shard_attack_damage extends BaseModifier_Plus {
    attack_damage_pct: number;
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
    Init(params: IModifierTable) {
        this.attack_damage_pct = this.GetSpecialValueFor("attack_damage_pct")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    GetBaseDamageOutgoing_Percentage() {
        return this.attack_damage_pct - 100
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_juggernaut_1_damage extends modifier_particle {
    blade_fury_damage: number;
    blade_fury_damage_tick: number;
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        this.blade_fury_damage = this.GetSpecialValueFor("blade_fury_damage") + hCaster.GetTalentValue("special_bonus_unique_juggernaut_custom")
        this.blade_fury_damage_tick = this.GetSpecialValueFor("blade_fury_damage_tick")
        if (IsServer()) {
            EmitSoundOnLocationWithCaster(hParent.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Juggernaut.BladeFury.Impact", hCaster), hCaster)
            let tDamageTable = {
                ability: hAbility,
                victim: hParent,
                attacker: hCaster,
                damage: this.blade_fury_damage * this.blade_fury_damage_tick,
                damage_type: hAbility.GetAbilityDamageType()
            }
            BattleHelper.GoApplyDamage(tDamageTable)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_juggernaut/juggernaut_blade_fury_tgt.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }

}
