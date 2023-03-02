import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_kunkka_x_marks_the_spot = { "ID": "5033", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_BOTH", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "1", "AbilitySound": "Ability.XMarksTheSpot.Target", "AbilityCastRange": "400 600 800 1000", "AbilityCastPoint": "0.4 0.4 0.4 0.4", "AbilityCooldown": "24 20 16 12", "AbilityManaCost": "50", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "4.0" }, "02": { "var_type": "FIELD_FLOAT", "allied_duration": "8.0" }, "03": { "var_type": "FIELD_INTEGER", "fow_range": "400" }, "04": { "var_type": "FIELD_FLOAT", "fow_duration": "5.94" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_kunkka_x_marks_the_spot extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "kunkka_x_marks_the_spot";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_kunkka_x_marks_the_spot = Data_kunkka_x_marks_the_spot;
    Init() {
        this.SetDefaultSpecialValue("tide_damage_pct", 70);
        this.SetDefaultSpecialValue("shard_tide_damage_pct", 100);
        this.SetDefaultSpecialValue("shard_tide_damage_crit", 800);
        this.SetDefaultSpecialValue("add_atk_pct_perS", 16);
        this.SetDefaultSpecialValue("cleave_start_length", 400);
        this.SetDefaultSpecialValue("cleave_end_length", 800);
        this.SetDefaultSpecialValue("cleave_distance", 1600);
        this.SetDefaultSpecialValue("base_attack_bonus", [400, 800, 1200, 1600, 2000]);
        this.SetDefaultSpecialValue("cooldown", [9, 8, 7, 6, 5]);
        this.SetDefaultSpecialValue("cleave_percent", [100, 130, 160, 190, 220]);
        this.SetDefaultSpecialValue("tide_crit", 200);
        this.SetDefaultSpecialValue("ebb_attack_time", 0.1);
        this.SetDefaultSpecialValue("ebb_damage_pct", 50);

    }


    OnToggle() {
        let hCaster = this.GetCasterPlus()
        if (this.GetLevel() == 0 && this.GetToggleState() == false) {
            modifier_kunkka_3_tide.remove(hCaster);
            modifier_kunkka_3_ebb.remove(hCaster);
            return
        }
        if (this.GetToggleState() == true) {
            modifier_kunkka_3_ebb.remove(hCaster);
            modifier_kunkka_3_tide.remove(hCaster);
            modifier_kunkka_3_tide.apply(hCaster, hCaster, this, null)
        } else {
            modifier_kunkka_3_ebb.remove(hCaster);
            modifier_kunkka_3_tide.remove(hCaster);
            modifier_kunkka_3_ebb.apply(hCaster, hCaster, this, null)
        }
    }
    ProcsMagicStick() {
        return false
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_kunkka_3"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
//  Modifiers
@registerModifier()
export class modifier_kunkka_3 extends BaseModifier_Plus {
    cleave_start_length: number;
    cleave_end_length: number;
    cleave_distance: number;
    cleave_percent: number;
    attack_bonus: number;
    base_attack_bonus: number;
    cooldown: number;
    records: Array<any>;
    hBuffPtcl: modifier_kunkka_3_particle_weapon;
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
    DestroyOnExpire() {
        return false
    }
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            this.records = []
            this.StartIntervalThink(0)
        }
    }
    Init(params: IModifierTable) {
        this.cleave_start_length = this.GetSpecialValueFor("cleave_start_length")
        this.cleave_end_length = this.GetSpecialValueFor("cleave_end_length")
        this.cleave_distance = this.GetSpecialValueFor("cleave_distance")
        this.cleave_percent = this.GetSpecialValueFor("cleave_percent")
        this.attack_bonus = this.GetSpecialValueFor("attack_bonus")
        this.base_attack_bonus = this.GetSpecialValueFor("base_attack_bonus")
        this.cooldown = this.GetSpecialValueFor("cooldown")
    }
    BeDestroy() {

        if (GFuncEntity.IsValid(this.hBuffPtcl)) {
            this.hBuffPtcl.Destroy()
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let parent = this.GetParentPlus()
            this.hBuffPtcl = modifier_kunkka_3_particle_weapon.apply(parent, parent, this.GetAbilityPlus())
            EmitSoundOnLocationForAllies(parent.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Kunkaa.Tidebringer", parent), parent)
            this.StartIntervalThink(-1)
            this.SetStackCount(1)
            if (parent.HasTalent("special_bonus_unique_kunkka_custom_8") && !modifier_kunkka_3_talent.exist(parent)) {
                modifier_kunkka_3_talent.apply(parent, parent, this.GetAbilityPlus(), null)
            } else if (!parent.HasTalent("special_bonus_unique_kunkka_custom_8") && modifier_kunkka_3_talent.exist(parent)) {
                modifier_kunkka_3_talent.remove(parent);
            }
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        if (IsServer() && params.attacker != null && this.records.indexOf(params.record) != -1) {
            let extar_attack_bonus = params.attacker.HasTalent("special_bonus_unique_kunkka_custom_5") && params.attacker.GetTalentValue("special_bonus_unique_kunkka_custom_5") || 0
            return this.base_attack_bonus + extar_attack_bonus
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus()) {
            if (this.records.indexOf(params.record) != -1) {
                if (GFuncEntity.IsValid(this.hBuffPtcl)) {
                    this.hBuffPtcl.Destroy()
                }
                this.StartIntervalThink(this.GetCasterPlus().HasTalent("special_bonus_unique_kunkka_custom_7") && 0 || this.cooldown)
                this.SetDuration(this.GetCasterPlus().HasTalent("special_bonus_unique_kunkka_custom_7") && 0 || this.cooldown, true)

                let sParticlePath = ResHelper.GetParticleReplacement("particles/units/heroes/hero_kunkka/kunkka_spell_tidebringer.vpcf", params.attacker)
                let iParticleID = ResHelper.CreateParticle({
                    resPath: sParticlePath,
                    resNpc: null,
                    iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                    owner: params.attacker
                });

                let n = 0
                AoiHelper.DoCleaveAction(
                    params.attacker,
                    params.target,
                    this.cleave_start_length,
                    this.cleave_end_length,
                    this.cleave_distance,
                    (hTarget) => {
                        BattleHelper.GoApplyDamage({
                            ability: this.GetAbilityPlus(),
                            victim: hTarget,
                            attacker: params.attacker,
                            damage: params.original_damage * this.cleave_percent * 0.01,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_USE_COMBAT_PROFICIENCY,
                            eom_flags: BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_CLEAVE + BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_NO_SPELL_CRIT,
                        })

                        n = n + 1

                        ParticleManager.SetParticleControlEnt(iParticleID, n + 1, hTarget, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hTarget.GetAbsOrigin(), true)
                    }
                )
                ParticleManager.SetParticleControl(iParticleID, 1, Vector(2, 17, n))
                ParticleManager.ReleaseParticleIndex(iParticleID)
                EmitSoundOnLocationWithCaster(params.target.GetAbsOrigin(), "Hero_Kunkka.TidebringerDamage", params.attacker)
                this.SetStackCount(0)
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    attackRecord(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK)) {
            if (!this.GetParentPlus().PassivesDisabled() && this.GetStackCount() == 1 && this.GetAbilityPlus().IsOwnersManaEnough() && this.GetAbilityPlus().CastFilterResult() == UnitFilterResult.UF_SUCCESS) {
                modifier_kunkka_3_animation.apply(params.attacker, params.attacker, this.GetAbilityPlus())
                table.insert(this.records, params.record)
            } else {
                modifier_kunkka_3_animation.remove(params.attacker);
            }
        }
    }
    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ATTACK_SOUND)
    // Get_AttackSound() {
    //     if (IsServer() && params.attacker != null) {
    //         if (TableFindKey(this.records, params.record) != null) {
    //             return ResHelper.GetSoundReplacement("Hero_Kunkka.Tidebringer.Attack", params.attacker)
    //         }
    //     }
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_kunkka_3_animation extends BaseModifier_Plus {
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
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    Get_ActivityTranslationModifiers() {
        return "tidebringer"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_kunkka_3_tide extends BaseModifier_Plus {
    cleave_start_length: number;
    cleave_end_length: number;
    cleave_distance: number;
    cleave_percent: number;
    tide_crit: number;
    tide_damage_pct: number;
    shard_tide_damage_pct: number;
    shard_tide_damage_crit: number;
    records: Array<any>;
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

        if (IsServer()) {
            this.records = []
        }
    }
    Init(params: IModifierTable) {
        this.cleave_start_length = this.GetSpecialValueFor("cleave_start_length")
        this.cleave_end_length = this.GetSpecialValueFor("cleave_end_length")
        this.cleave_distance = this.GetSpecialValueFor("cleave_distance")
        this.cleave_percent = this.GetSpecialValueFor("cleave_percent")
        this.tide_crit = this.GetSpecialValueFor("tide_crit")
        this.tide_damage_pct = this.GetSpecialValueFor("tide_damage_pct")
        this.shard_tide_damage_pct = this.GetSpecialValueFor("shard_tide_damage_pct")
        this.shard_tide_damage_crit = this.GetSpecialValueFor("shard_tide_damage_crit")
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY)
    On_AttackRecordDestroy(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            GameFunc.ArrayFunc.ArrayRemove(this.records, params.record)
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    On_AttackRecord(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        let attacker = params.attacker as IBaseNpc_Plus
        if (attacker == this.GetParentPlus() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK)) {
            if (!this.GetParentPlus().PassivesDisabled() && this.GetAbilityPlus().IsOwnersManaEnough() && this.GetAbilityPlus().CastFilterResult() == UnitFilterResult.UF_SUCCESS) {
                table.insert(this.records, params.record)
                if (modifier_kunkka_3_talent.exist(params.attacker)) {
                    let hModifier = modifier_kunkka_3_talent.findIn(params.attacker)
                    let duration = attacker.GetTalentValue("special_bonus_unique_kunkka_custom_8", "duration")
                    if (hModifier.GetStackCount() == hModifier.max_charge) {
                        let fInterval = hModifier.interval * params.attacker.GetCooldownReduction()
                        hModifier.SetDuration(fInterval, true)
                        hModifier.StartIntervalThink(fInterval)
                        hModifier.DecrementStackCount()
                        if (hModifier.GetAbilityPlus().GetToggleState() == true) {
                            modifier_kunkka_3_ebb.apply(params.attacker, params.attacker, this.GetAbilityPlus(), { duration: duration })
                        } else {
                            modifier_kunkka_3_tide.apply(params.attacker, params.attacker, this.GetAbilityPlus(), { duration: duration })
                        }
                    }
                }
            } else {
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus()) {
            if (this.records.indexOf(params.record) != -1) {
                let sParticlePath = ResHelper.GetParticleReplacement("particles/units/heroes/hero_kunkka/kunkka_spell_tidebringer.vpcf", params.attacker)
                let iParticleID = ResHelper.CreateParticle({
                    resPath: sParticlePath,
                    resNpc: null,
                    iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                    owner: params.attacker
                });

                let n = 0

                AoiHelper.DoCleaveAction(
                    params.attacker,
                    params.target,
                    this.cleave_start_length,
                    this.cleave_end_length,
                    this.cleave_distance,
                    (hTarget) => {
                        //  pipixia add 增加生命最大百分比攻擊
                        let damage = params.original_damage * this.cleave_percent * 0.01 * (((GFuncEntity.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().HasShard())) && this.shard_tide_damage_pct || this.tide_damage_pct) * 0.01
                        BattleHelper.GoApplyDamage({
                            ability: this.GetAbilityPlus(),
                            victim: hTarget,
                            attacker: params.attacker,
                            damage: damage,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_USE_COMBAT_PROFICIENCY,
                            eom_flags: BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_CLEAVE + BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_NO_SPELL_CRIT,
                        })

                        n = n + 1

                        ParticleManager.SetParticleControlEnt(iParticleID, n + 1, hTarget, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hTarget.GetAbsOrigin(), true)
                    }
                )
                ParticleManager.SetParticleControl(iParticleID, 1, Vector(2, 17, n))
                ParticleManager.ReleaseParticleIndex(iParticleID)

            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE)
    CC_GetModifierCriticalStrike(params: IModifierTable) {
        if (this.records.indexOf(params.record) != modifier_kunkka_3.GetStackIn(this.GetCasterPlus())) {
            if (GFuncEntity.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().HasShard()) {
                return this.shard_tide_damage_crit
            }
        }
        return this.tide_crit
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_kunkka_3_ebb extends BaseModifier_Plus {
    ebb_damage_pct: number;
    base_attack_bonus: number;
    ebb_attack_time: number;
    add_atk_pct_perS: number;
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
        this.ebb_damage_pct = this.GetSpecialValueFor("ebb_damage_pct")
        this.base_attack_bonus = this.GetSpecialValueFor("base_attack_bonus")
        this.ebb_attack_time = this.GetSpecialValueFor("ebb_attack_time")
        this.add_atk_pct_perS = this.GetSpecialValueFor("add_atk_pct_perS")
    }


    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    On_AttackRecord(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        let attacker = params.attacker as IBaseNpc_Plus
        if (attacker == this.GetParentPlus() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK)) {
            if (modifier_kunkka_3_talent.exist(attacker)) {
                let hModifier = modifier_kunkka_3_talent.findIn(params.attacker)
                let duration = attacker.GetTalentValue("special_bonus_unique_kunkka_custom_8", "duration")
                if (hModifier.GetStackCount() == hModifier.max_charge) {
                    let fInterval = hModifier.interval * params.attacker.GetCooldownReduction()
                    hModifier.SetDuration(fInterval, true)
                    hModifier.StartIntervalThink(fInterval)
                    hModifier.DecrementStackCount()
                    if (hModifier.GetAbilityPlus().GetToggleState() == true) {
                        modifier_kunkka_3_ebb.apply(params.attacker, params.attacker, this.GetAbilityPlus(), { duration: duration })
                    } else {
                        modifier_kunkka_3_tide.apply(params.attacker, params.attacker, this.GetAbilityPlus(), { duration: duration })
                    }
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: IModifierTable) {
        let extar_attack_bonus = this.GetParentPlus().HasTalent("special_bonus_unique_kunkka_custom_5") && this.GetParentPlus().GetTalentValue("special_bonus_unique_kunkka_custom_5") || 0
        let atk = (this.base_attack_bonus + extar_attack_bonus) * this.ebb_damage_pct * 0.01
        //  pipixia add 附加生命最大值攻擊
        atk = atk + this.GetCasterPlus().GetMaxHealth() * this.add_atk_pct_perS / 100;
        return atk
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT)
    GetBaseAttackTimeConstant(params: IModifierTable) {
        return 1.3 - this.ebb_attack_time
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_kunkka_3_talent extends BaseModifier_Plus {
    initialized: any;
    interval: number;
    max_charge: number;
    interval_scepter: number;
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
    RemoveOnDeath() {
        return false
    }
    DestroyOnExpire() {
        return false
    }
    Init_old() {
        if (IsServer()) {
            if (!this.initialized && this.GetAbilityPlus().GetLevel() != 0) {
                this.initialized = true

                let fInterval = this.interval * this.GetCasterPlus().GetCooldownReduction()
                this.SetDuration(fInterval, true)
                this.StartIntervalThink(fInterval)

                let time = GameRules.GetGameTime() + 1
                this.GetAbilityPlus().SetContextThink(
                    DoUniqueString("modifier_kunkka_3_talent"),
                    () => {
                        if (this.IsNull()) {
                            return
                        }
                        if (GameRules.GetGameTime() > time) {
                            time = GameRules.GetGameTime() + 1

                            if (this.GetStackCount() == 0) {
                                return 0
                            }
                        }
                        return 0
                    },
                    0
                )
            }
        }
    }
    BeCreated(params: IModifierTable) {

        this.max_charge = 1
        this.interval = this.GetCasterPlus().GetTalentValue("special_bonus_unique_kunkka_custom_8")
        if (IsServer()) {
            this.Init()
        }
    }
    BeRefresh(params: IModifierTable) {

        this.max_charge = 1
        this.interval = this.GetCasterPlus().GetTalentValue("special_bonus_unique_kunkka_custom_8")
        if (IsServer()) {
            this.Init()
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            this.IncrementStackCount()
            if (this.GetStackCount() == this.max_charge) {
                this.StartIntervalThink(-1)
            } else {
                let fInterval = this.interval_scepter * this.GetCasterPlus().GetCooldownReduction()
                this.SetDuration(fInterval, true)
                this.StartIntervalThink(fInterval)
            }
        }
    }
}

// 特效
@registerModifier()
export class modifier_kunkka_3_particle_weapon extends modifier_particle {
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let caster = this.GetCasterPlus()
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_kunkka/kunkka_weapon_tidebringer.vpcf",
                resNpc: caster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: caster
            });

            ParticleManager.SetParticleControlEnt(particleID, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_tidebringer", caster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(particleID, 1, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_tidebringer_2", caster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(particleID, 2, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_sword", caster.GetAbsOrigin(), true)
            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }
}
