import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_clinkz_1_buff } from "./ability1_clinkz_strafe";
import { modifier_clinkz_2_bonus_attackspeed } from "./ability2_clinkz_searing_arrows";
/** dota原技能数据 */
export const Data_clinkz_wind_walk = { "ID": "5261", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilitySound": "Hero_Clinkz.WindWalk", "HasShardUpgrade": "1", "AbilityCooldown": "20 19 18 17", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityManaCost": "75 75 75 75", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "25 30 35 40" }, "02": { "var_type": "FIELD_FLOAT", "fade_time": "0.6 0.6 0.6 0.6" }, "03": { "var_type": "FIELD_INTEGER", "move_speed_bonus_pct": "15 30 45 60" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_clinkz_wind_walk extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "clinkz_wind_walk";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_clinkz_wind_walk = Data_clinkz_wind_walk;
    Init() {
        this.SetDefaultSpecialValue("damage_bonus", [500, 1000, 1500, 2000, 2500]);
        this.SetDefaultSpecialValue("agi_damage_factor", [1.0, 1.2, 1.4, 1.7, 2.0]);

    }


    GetIntrinsicModifierName() {
        return "modifier_clinkz_3"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_clinkz_3 extends BaseModifier_Plus {
    damage_bonus: number;
    agi_damage_factor: number;
    records: any[];
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
            this.records = []
        }
    }
    Init(params: IModifierTable) {
        this.damage_bonus = this.GetSpecialValueFor("damage_bonus")
        this.agi_damage_factor = this.GetSpecialValueFor("agi_damage_factor")
    }


    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    On_AttackStart(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            if ((this.GetParentPlus().GetCurrentActiveAbility() == this.GetAbilityPlus() || this.GetAbilityPlus().GetAutoCastState()) && !this.GetParentPlus().IsSilenced() && this.GetAbilityPlus().IsCooldownReady() && this.GetAbilityPlus().IsOwnersManaEnough() && this.GetAbilityPlus().CastFilterResult() == UnitFilterResult.UF_SUCCESS) {
                if (params.attacker.IsSummoned()) {
                    modifier_clinkz_3_projectile.apply(params.attacker, (params.attacker as IBaseNpc_Plus).GetSummoner(), this.GetAbilityPlus(), null)
                } else {
                    modifier_clinkz_3_projectile.apply(params.attacker, params.attacker, this.GetAbilityPlus(), null)
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    On_AttackRecord(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            modifier_clinkz_3_projectile.remove(params.attacker);
            if ((this.GetParentPlus().GetCurrentActiveAbility() == this.GetAbilityPlus() || this.GetAbilityPlus().GetAutoCastState()) && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS) && !this.GetParentPlus().IsSilenced() && this.GetAbilityPlus().IsCooldownReady() && this.GetAbilityPlus().IsOwnersManaEnough() && this.GetAbilityPlus().CastFilterResult() == UnitFilterResult.UF_SUCCESS) {
                table.insert(this.records, params.record)
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: ModifierAttackEvent) {
        if (GameFunc.IsValid(params.attacker) && GameFunc.IsValid(params.target)) {
            let hCaster = (GameFunc.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().IsSummoned() && GameFunc.IsValid(this.GetCasterPlus().GetSummoner())) && this.GetCasterPlus().GetSummoner() || this.GetCasterPlus()
            let sTalentName = "special_bonus_unique_clinkz_custom_1"
            if (!params.attacker.IsIllusion() && hCaster.GetAgility != null) {
                if (this.records.indexOf(params.record) != null) {
                    let damage = this.damage_bonus + hCaster.GetAgility() * this.agi_damage_factor
                    if (modifier_clinkz_1_buff.exist(hCaster)) {
                        let hModifier1 = modifier_clinkz_1_buff.findIn(hCaster)
                        damage = damage + hModifier1.GetStackCount()
                    }
                    // 释放了骨隐步,提升灼热之剑额外百分比伤害
                    if (modifier_clinkz_2_bonus_attackspeed.exist(hCaster)) {
                        let hModifier = modifier_clinkz_2_bonus_attackspeed.findIn(hCaster) as IBaseModifier_Plus;
                        let hAbility = hModifier.GetAbilityPlus()
                        if (GameFunc.IsValid(hAbility)) {
                            damage = damage + damage * hAbility.GetSpecialValueFor("bonus_damage_percent") * 0.01
                        }
                    }
                    return damage + hCaster.GetTalentValue(sTalentName)
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    On_Attack(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS)) {
            if (this.records.indexOf(params.record) != null) {
                params.attacker.EmitSound(ResHelper.GetSoundReplacement("Hero_Clinkz.SearingArrows", params.attacker))
                // if (!modifier_clinkz_2_bonus_attackspeed.exist(params.attacker) && !modifier_clinkz_6_summon.exist(params.attacker)) {
                //     this.GetAbilityPlus().UseResources(true, true, true)
                // }
                if (!BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK)) {
                    let sTalentName = "special_bonus_unique_clinkz_custom_3"
                    let hCaster = (this.GetCasterPlus().IsSummoned() && GameFunc.IsValid(this.GetCasterPlus().GetSummoner())) && this.GetCasterPlus().GetSummoner() || this.GetCasterPlus()
                    if (hCaster.HasTalent(sTalentName)) {
                        let arrow_count = hCaster.GetTalentValue(sTalentName)
                        let count = 0
                        let targets = AoiHelper.FindEntityInRadius(params.attacker.GetTeamNumber(), params.attacker.GetAbsOrigin(), params.attacker.Script_GetAttackRange() + params.attacker.GetHullRadius() + hCaster.GetTalentValue(sTalentName, "bonus_range"), null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_CLOSEST)
                        for (let target of targets) {
                            if (target != params.target) {
                                count = count + 1
                                let iAttackState = BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING
                                BattleHelper.Attack(params.attacker, target, iAttackState)

                                if (count >= arrow_count) {
                                    break
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            if (this.records.indexOf(params.record) != null) {
                params.target.EmitSound(ResHelper.GetSoundReplacement("Hero_Clinkz.SearingArrows.Impact", params.attacker))
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY)
    On_AttackRecordDestroy(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            GameFunc.ArrayFunc.ArrayRemove(this.records, params.record)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_clinkz_3_projectile extends BaseModifier_Plus {
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
    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_ULTRA
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_NAME)
    GetProjectileName(params: IModifierTable) {
        return ResHelper.GetParticleReplacement("particles/units/heroes/hero_clinkz/clinkz_searing_arrow.vpcf", this.GetCasterPlus())
    }
}
