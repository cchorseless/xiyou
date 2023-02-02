import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_riki_1_debuff } from "./ability1_riki_smoke_screen";

/** dota原技能数据 */
export const Data_riki_tricks_of_the_trade = { "ID": "5145", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_CHANNELLED | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_FRIENDLY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "HasScepterUpgrade": "1", "AbilitySound": "Hero_Riki.TricksOfTheTrade.Cast", "AbilityCastRange": "400", "AbilityCastPoint": "0.3", "AbilityChannelTime": "2.0", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityChannelAnimation": "ACT_DOTA_CHANNEL_ABILITY_4", "AbilityCooldown": "21 18 15 12", "AbilityManaCost": "50", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "450", "LinkedSpecialBonus": "special_bonus_unique_riki_4" }, "02": { "var_type": "FIELD_INTEGER", "attack_count": "4" }, "03": { "var_type": "FIELD_INTEGER", "damage_pct": "50" }, "04": { "var_type": "FIELD_INTEGER", "agility_pct": "55 70 85 100" }, "05": { "var_type": "FIELD_FLOAT", "scepter_duration": "2", "RequiresScepter": "1" }, "06": { "var_type": "FIELD_INTEGER", "scepter_attacks": "4", "RequiresScepter": "1" }, "07": { "var_type": "FIELD_INTEGER", "scepter_cast_range": "700", "RequiresScepter": "1" } } };

@registerAbility()
export class ability3_riki_tricks_of_the_trade extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "riki_tricks_of_the_trade";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_riki_tricks_of_the_trade = Data_riki_tricks_of_the_trade;
    Init() {
        this.SetDefaultSpecialValue("agi_damage_factor", [8, 10, 12, 14, 16]);
        this.SetDefaultSpecialValue("backstab_angle", 105);

    }


    GetIntrinsicModifierName() {
        return "modifier_riki_3"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_riki_3 extends BaseModifier_Plus {
    agi_damage_factor: number;
    backstab_angle: number;
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.records = []
        }
    }
    Init(params: IModifierTable) {
        this.agi_damage_factor = this.GetSpecialValueFor("agi_damage_factor")
        this.backstab_angle = this.GetSpecialValueFor("backstab_angle")
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    On_AttackStart(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            let fTargetAngle = params.target.GetAnglesAsVector().y
            let vDifference = (params.target.GetAbsOrigin() - params.attacker.GetAbsOrigin()) as Vector
            let vDifferenceRadian = math.atan2(vDifference.y, vDifference.x) * 180
            let fAttackerAngle = vDifferenceRadian / math.pi
            fAttackerAngle = fAttackerAngle + 180

            let fResultAngle = fAttackerAngle - fTargetAngle
            fResultAngle = math.abs(fResultAngle)
            if (fResultAngle >= (180 - this.backstab_angle) && fResultAngle <= (180 + this.backstab_angle)) {
                modifier_riki_3_translation.apply(params.attacker, params.attacker, this.GetAbilityPlus(), { duration: params.attacker.GetAttackSpeed() })
            }
        }
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
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            if (modifier_riki_3_translation.exist(params.attacker)) {
                table.insert(this.records, params.record)
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (!GameFunc.IsValid(params.target) || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == hParent && !params.attacker.IsIllusion()) {
            if (this.records.indexOf(params.record) != null) {
                let iParticleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_riki/riki_backstab.vpcf",
                    resNpc: this.GetCasterPlus(),
                    iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                    owner: params.target
                });

                ParticleManager.SetParticleControlEnt(iParticleID, 0, params.target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", params.target.GetAbsOrigin(), true)
                ParticleManager.ReleaseParticleIndex(iParticleID)
                EmitSoundOnLocationWithCaster(params.target.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Riki.Backstab", this.GetCasterPlus()), this.GetCasterPlus())
            }
            if (this.GetParentPlus().HasTalent("special_bonus_unique_riki_custom_1") && !params.attacker.IsRangedAttacker() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE) && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                let sParticlePath = ResHelper.GetParticleReplacement("particles/items_fx/battlefury_cleave.vpcf", params.attacker)
                let iParticleID = ResHelper.CreateParticle({
                    resPath: sParticlePath,
                    resNpc: null,
                    iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                    owner: params.attacker
                });

                let n = 0
                let cleave_starting_width = this.GetParentPlus().GetTalentValue("special_bonus_unique_riki_custom_1", "cleave_starting_width")
                let cleave_ending_width = this.GetParentPlus().GetTalentValue("special_bonus_unique_riki_custom_1", "cleave_ending_width")
                let cleave_distance = this.GetParentPlus().GetTalentValue("special_bonus_unique_riki_custom_1", "cleave_distance")
                AoiHelper.DoCleaveAction(params.attacker, params.target, cleave_starting_width, cleave_ending_width, cleave_distance, (hTarget) => {
                    let tDamageTable = {
                        ability: this.GetAbilityPlus(),
                        victim: hTarget,
                        attacker: params.attacker,
                        damage: params.original_damage * this.GetParentPlus().GetTalentValue("special_bonus_unique_riki_custom_1") * 0.01,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_USE_COMBAT_PROFICIENCY,
                        eom_flags: BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_CLEAVE + BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_NO_SPELL_CRIT,
                    }
                    let x = BattleHelper.GoApplyDamage(tDamageTable)
                    n = n + 1

                    ParticleManager.SetParticleControlEnt(iParticleID, n + 1, hTarget, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hTarget.GetAbsOrigin(), true)
                })
                ParticleManager.SetParticleControl(iParticleID, 1, Vector(2, 17, n))
                ParticleManager.ReleaseParticleIndex(iParticleID)

                params.attacker.EmitSound("DOTA_Item.BattleFury")
            }
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: IModifierTable) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (!params.attacker.IsIllusion()) {
            let value = 0
            let damage = (this.agi_damage_factor + this.GetCasterPlus().GetTalentValue("special_bonus_unique_riki_custom_5")) * this.GetCasterPlus().GetAgility()
            if (modifier_riki_1_debuff.exist(params.target)) {
                value = value + damage + damage * this.GetCasterPlus().GetTalentValue("special_bonus_unique_riki_custom_8")
            }
            if (this.records.indexOf(params.record) != null) {
                value = value + damage
            }
            return value
        }
    }
    // @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    // Get_ActivityTranslationModifiers() {
    //     if (TableFindKey(this.records, params.record) != null) {
    //         return "backstab"
    //     }
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_riki_3_translation extends BaseModifier_Plus {
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    Get_ActivityTranslationModifiers() {
        return "backstab"
    }
}
