import { GameFunc } from "../../../../GameFunc";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_magnataur_shockwave = { "ID": "5518", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_POINT", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "HasScepterUpgrade": "1", "AbilityCastRange": "1200", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "13 12 11 10", "AbilityDuration": "0.6875 0.6875 0.6875 0.6875", "AbilityManaCost": "80 90 100 110", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "shock_speed": "900" }, "02": { "var_type": "FIELD_INTEGER", "shock_width": "200" }, "03": { "var_type": "FIELD_INTEGER", "shock_damage": "75 150 225 300", "LinkedSpecialBonus": "special_bonus_unique_magnus_4" }, "04": { "var_type": "FIELD_FLOAT", "pull_duration": "0.2" }, "05": { "var_type": "FIELD_INTEGER", "movement_slow": "75" }, "06": { "var_type": "FIELD_FLOAT", "slow_duration": "2" }, "07": { "var_type": "FIELD_INTEGER", "pull_distance": "150" }, "08": { "var_type": "FIELD_FLOAT", "basic_slow_duration": "0.9", "LinkedSpecialBonus": "special_bonus_unique_magnus_6" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_magnataur_shockwave extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "magnataur_shockwave";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_magnataur_shockwave = Data_magnataur_shockwave;
    Init() {
        this.SetDefaultSpecialValue("shock_chance", 20);
        this.SetDefaultSpecialValue("shock_speed", 900);
        this.SetDefaultSpecialValue("shock_distance", 1200);
        this.SetDefaultSpecialValue("shock_width", 200);
        this.SetDefaultSpecialValue("shock_damage", [900, 1400, 1900, 2400, 3000]);
        this.SetDefaultSpecialValue("shock_attack_damage", [80, 120, 160, 200, 250]);
        this.SetDefaultSpecialValue("shock_bonus_damage_pct", 3);
        this.SetDefaultSpecialValue("shock_bonus_duration", 5);

    }


    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        let hCaster = this.GetCasterPlus()
        if (GameFunc.IsValid(hTarget)) {
            let hAttacker = EntIndexToHScript(ExtraData.attacker_ent_index || -1) as IBaseNpc_Plus
            if (!GameFunc.IsValid(hAttacker)) {
                return false
            }
            modifier_magnataur_1_hit_particle.apply(hAttacker, hTarget, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
            modifier_magnataur_1_attack.apply(hAttacker, hCaster, this, null)

            let iAttackState = BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NEVERMISS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING
            if (hCaster.HasTalent("special_bonus_unique_magnataur_custom_6")) {
                iAttackState = iAttackState - (BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS)
            }
            BattleHelper.Attack(hAttacker, hTarget, iAttackState)

            modifier_magnataur_1_attack.remove(hAttacker);

            modifier_magnataur_1_shock_buff.apply(hAttacker, hCaster, this, { duration: this.GetSpecialValueFor("shock_bonus_duration") })

            return false
        }
        return true
    }
    GetIntrinsicModifierName() {
        return "modifier_magnataur_1"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_magnataur_1 extends BaseModifier_Plus {
    shock_chance: number;
    shock_speed: number;
    shock_distance: number;
    shock_bonus_duration: number;
    shock_width: number;
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
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let extra_shock_chance = hCaster.GetTalentValue("special_bonus_unique_magnataur_custom_5")
        this.shock_chance = this.GetSpecialValueFor("shock_chance") + extra_shock_chance
        this.shock_speed = this.GetSpecialValueFor("shock_speed")
        this.shock_distance = this.GetSpecialValueFor("shock_distance")
        this.shock_width = this.GetSpecialValueFor("shock_width")
        this.shock_bonus_duration = this.GetSpecialValueFor("shock_bonus_duration")
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus()) {
            let hCaster = this.GetCasterPlus()
            if (UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                if (!modifier_magnataur_1_attack.exist(params.attacker) && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK)) {
                    if (GameFunc.mathUtil.PRD(this.shock_chance, params.attacker, "magnataur_4")) {
                        params.attacker.EmitSound(ResHelper.GetSoundReplacement("Hero_Magnataur.ShockWave.Cast", hCaster))
                        params.attacker.EmitSound(ResHelper.GetSoundReplacement("Hero_Magnataur.ShockWave.Particle", hCaster))
                        let vDirection = (params.target.GetAbsOrigin() - params.attacker.GetAbsOrigin()) as Vector;
                        vDirection.z = 0
                        let tInfo = {
                            Ability: this.GetAbilityPlus(),
                            Source: params.attacker,
                            EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_magnataur/magnataur_shockwave.vpcf", hCaster),
                            vSpawnOrigin: params.attacker.GetAbsOrigin(),
                            vVelocity: (vDirection.Normalized() * this.shock_speed) as Vector,
                            fDistance: this.shock_distance,
                            fStartRadius: this.shock_width,
                            fEndRadius: this.shock_width,
                            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES,
                            fExpireTime: GameRules.GetGameTime() + 10,
                            ExtraData: {
                                attacker_ent_index: params.attacker.entindex(),
                            }
                        }
                        ProjectileManager.CreateLinearProjectile(tInfo)
                        if (hCaster.HasShard()) {
                            hCaster.addTimer(this.shock_distance / this.shock_speed, () => {
                                let tInfo = {
                                    Ability: this.GetAbilityPlus(),
                                    Source: params.attacker,
                                    EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_magnataur/magnataur_shockwave.vpcf", hCaster),
                                    vSpawnOrigin: (params.attacker.GetAbsOrigin() + vDirection.Normalized() * this.shock_distance) as Vector,
                                    vVelocity: (-vDirection.Normalized() * this.shock_speed) as Vector,
                                    fDistance: this.shock_distance,
                                    fStartRadius: this.shock_width,
                                    fEndRadius: this.shock_width,
                                    iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                                    iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                                    iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES,
                                    fExpireTime: GameRules.GetGameTime() + 10,
                                    ExtraData: {
                                        attacker_ent_index: params.attacker.entindex(),
                                    }
                                }
                                ProjectileManager.CreateLinearProjectile(tInfo)
                            })
                        }
                    }
                }
            }
        }
    }
}
// 为什么写这个buff呢，因为马格纳斯给自己添加授予力量时，授予力量的震荡波和被动的震荡波叠加
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_magnataur_1_buff extends BaseModifier_Plus {
    shock_chance: number;
    shock_speed: number;
    shock_distance: number;
    shock_width: number;
    shock_bonus_duration: number;
    IsHidden() {
        return true
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
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let extra_shock_chance = hCaster.HasTalent("special_bonus_unique_magnataur_custom_5") && hCaster.GetTalentValue("special_bonus_unique_magnataur_custom_5") || 0
        this.shock_chance = this.GetSpecialValueFor("shock_chance") + extra_shock_chance
        this.shock_speed = this.GetSpecialValueFor("shock_speed")
        this.shock_distance = this.GetSpecialValueFor("shock_distance")
        this.shock_width = this.GetSpecialValueFor("shock_width")
        this.shock_bonus_duration = this.GetSpecialValueFor("shock_bonus_duration")
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (!GameFunc.IsValid(params.target) || params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus()) {
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus()
            if (GameFunc.IsValid(hCaster) && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                if (!modifier_magnataur_1_attack.exist(params.attacker) && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK)) {
                    if (GameFunc.mathUtil.PRD(this.shock_chance, params.attacker, "magnataur_4")) {
                        params.attacker.EmitSound(ResHelper.GetSoundReplacement("Hero_Magnataur.ShockWave.Cast", hCaster))
                        params.attacker.EmitSound(ResHelper.GetSoundReplacement("Hero_Magnataur.ShockWave.Particle", hCaster))
                        let vDirection = (params.target.GetAbsOrigin() - params.attacker.GetAbsOrigin()) as Vector
                        vDirection.z = 0
                        let tInfo = {
                            Ability: hAbility,
                            Source: params.attacker,
                            EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_magnataur/magnataur_shockwave.vpcf", hCaster),
                            vSpawnOrigin: params.attacker.GetAbsOrigin(),
                            vVelocity: (vDirection.Normalized() * this.shock_speed) as Vector,
                            fDistance: this.shock_distance,
                            fStartRadius: this.shock_width,
                            fEndRadius: this.shock_width,
                            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES,
                            fExpireTime: GameRules.GetGameTime() + 10,
                            ExtraData: {
                                attacker_ent_index: params.attacker.entindex(),
                            }
                        }
                        ProjectileManager.CreateLinearProjectile(tInfo)
                        if (hCaster.HasShard()) {
                            hCaster.addTimer(this.shock_distance / this.shock_speed, () => {
                                let tInfo = {
                                    Ability: hAbility,
                                    Source: params.attacker,
                                    EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_magnataur/magnataur_shockwave.vpcf", hCaster),
                                    vSpawnOrigin: (params.attacker.GetAbsOrigin() + vDirection.Normalized() * this.shock_distance) as Vector,
                                    vVelocity: (-vDirection.Normalized() * this.shock_speed) as Vector,
                                    fDistance: this.shock_distance,
                                    fStartRadius: this.shock_width,
                                    fEndRadius: this.shock_width,
                                    iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                                    iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                                    iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES,
                                    fExpireTime: GameRules.GetGameTime() + 10,
                                    ExtraData: {
                                        attacker_ent_index: params.attacker.entindex(),
                                    }
                                }
                                ProjectileManager.CreateLinearProjectile(tInfo)
                            })
                        }
                    }
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_magnataur_1_attack extends BaseModifier_Plus {
    shock_damage: number;
    shock_attack_damage: number;
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
        let hCaster = this.GetCasterPlus()
        this.shock_damage = this.GetSpecialValueFor("shock_damage")
        this.shock_attack_damage = this.GetSpecialValueFor("shock_attack_damage") - 100
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ATTACK_SOUND)
    G_AttackSound() {
        return ResHelper.GetSoundReplacement("Hero_Magnataur.ShockWave.Target", this.GetCasterPlus())
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: IModifierTable) {
        return this.shock_damage / ((this.shock_attack_damage + 100) * 0.01)
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage(params: IModifierTable) {
        return this.shock_attack_damage
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_magnataur_1_shock_buff extends BaseModifier_Plus {
    shock_bonus_damage_pct: number;
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
    GetTexture() {
        return ResHelper.GetAbilityTextureReplacement("magnataur_shockwave", this.GetCasterPlus())
    }
    Init(params: IModifierTable) {
        let extra_shock_bonus_damage_pct = this.GetCasterPlus().HasTalent("special_bonus_unique_magnataur_custom_7") && this.GetCasterPlus().GetTalentValue("special_bonus_unique_magnataur_custom_7") || 0
        this.shock_bonus_damage_pct = this.GetSpecialValueFor("shock_bonus_damage_pct") + extra_shock_bonus_damage_pct
        if (IsServer()) {
            this.IncrementStackCount()
            this.addTimer(params.duration, () => {
                this.DecrementStackCount()
            })

        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    GetBaseDamageOutgoing_Percentage(params: IModifierTable) {
        return this.shock_bonus_damage_pct * this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_magnataur_1_hit_particle extends modifier_particle {
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_magnataur/magnataur_shockwave_hit.vpcf",
                resNpc: this.GetParentPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetCasterPlus()
            });

            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }


}
