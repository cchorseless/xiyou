
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { modifier_antimage_3_buff } from "./ability3_antimage_counterspell";
import { ability6_antimage_mana_void } from "./ability6_antimage_mana_void";

/** dota原技能数据 */
export const Data_antimage_mana_break = { "ID": "5003", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "AbilitySound": "Hero_Antimage.ManaBreak", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "percent_damage_per_burn": "50" }, "02": { "var_type": "FIELD_INTEGER", "mana_per_hit": "28 40 52 64" }, "03": { "var_type": "FIELD_FLOAT", "mana_per_hit_pct": "1 1.8 2.6 3.4", "LinkedSpecialBonus": "special_bonus_unique_antimage_7" }, "04": { "var_type": "FIELD_INTEGER", "silence_chance": "15" }, "05": { "var_type": "FIELD_FLOAT", "silence_duration": "3" }, "06": { "var_type": "FIELD_INTEGER", "illusion_percentage": "50" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_antimage_mana_break extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "antimage_mana_break";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_antimage_mana_break = Data_antimage_mana_break;
    Init() {
        this.SetDefaultSpecialValue("damage_per_burn", 50);
        this.SetDefaultSpecialValue("mana_per_hit", [32, 64, 96, 128, 160, 192]);
        this.SetDefaultSpecialValue("damage_per_mana", 0.35);
        this.SetDefaultSpecialValue("agi_per_overflow", 8);
        this.SetDefaultSpecialValue("agi_per_overflow_scepter", 30);
        this.SetDefaultSpecialValue("agi_duration", 10);
        this.SetDefaultSpecialValue("max_mana_per_overflow", 100);
        this.SetDefaultSpecialValue("duration", [4, 4.5, 5, 5.5, 6, 6.5]);
        this.SetDefaultSpecialValue("shard_trigger_chance", 10);

    }





    GetIntrinsicModifierName() {
        return "modifier_antimage_1"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_antimage_1 extends BaseModifier_Plus {
    damage_per_burn: number;
    mana_per_hit: number;
    agi_per_overflow: number;
    agi_per_overflow_scepter: number;
    agi_duration: number;
    max_mana_per_overflow: number;
    duration: number;
    shard_trigger_chance: number;
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
        this.damage_per_burn = this.GetSpecialValueFor("damage_per_burn")
        this.mana_per_hit = this.GetSpecialValueFor("mana_per_hit")
        this.damage_per_burn = this.GetSpecialValueFor("damage_per_mana")
        this.agi_per_overflow = this.GetSpecialValueFor("agi_per_overflow")
        this.agi_per_overflow_scepter = this.GetSpecialValueFor("agi_per_overflow_scepter")
        this.agi_duration = this.GetSpecialValueFor("agi_duration")
        this.max_mana_per_overflow = this.GetSpecialValueFor("max_mana_per_overflow")
        this.duration = this.GetSpecialValueFor("duration")
        this.shard_trigger_chance = this.GetSpecialValueFor("shard_trigger_chance")
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_FEEDBACK)
    GetProcAttack_Feedback(params: ModifierAttackEvent) {
        let hCaster = params.attacker as IBaseNpc_Plus
        let hTarget = params.target as IBaseNpc_Plus
        if (!hCaster.PassivesDisabled() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS) && UnitFilter(hTarget, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, hCaster.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
            let sTalentName = "special_bonus_unique_antimage_custom_6"
            let mana_per_hit = this.mana_per_hit + hCaster.GetSource().GetTalentValue(sTalentName)
            let total_burn_mana = math.min(mana_per_hit, hTarget.GetMana())
            let fOverflow = mana_per_hit - total_burn_mana  //  溢出损毁魔法
            hTarget.ReduceMana(total_burn_mana)

            let hAbility_6 = ability6_antimage_mana_void.findIn(hCaster) as ability6_antimage_mana_void;
            if (GFuncEntity.IsValid(hAbility_6) && hAbility_6.GetLevel() >= 1) {
                let radius = hAbility_6.GetSpecialValueFor("radius")
                let duration = hAbility_6.GetSpecialValueFor("duration")
                let mana_percent = hAbility_6.GetSpecialValueFor("mana_percent")
                let bonus_mana_limit = mana_per_hit * mana_percent * 0.01
                let units = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetSource().GetAbsOrigin(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST)
                for (let unit of (units)) {
                    if (GFuncEntity.IsValid(unit) && unit.IsAlive() && unit.GetUnitLabel() == "HERO") {
                        // 敌法师不能给召唤无添加加最大蓝上限问题
                        modifier_antimage_3_buff.apply(unit, hCaster.GetSource(), hAbility_6, { duration: duration, total_burn_mana: bonus_mana_limit })
                    }
                }
            }

            sTalentName = "special_bonus_unique_antimage_custom_8"
            let max_mana_per_overflow = this.max_mana_per_overflow + hCaster.GetTalentValue(sTalentName)
            let agi_duration = this.agi_duration
            if (fOverflow > 0) {
                modifier_antimage_1_max_mana.apply(hTarget, hCaster, this.GetAbilityPlus(), { duration: this.duration, value: fOverflow * max_mana_per_overflow * 0.01 })
                let agi_per_overflow = hCaster.HasScepter() && this.agi_per_overflow_scepter || this.agi_per_overflow
                modifier_antimage_1_buff.apply(hCaster, hCaster, this.GetAbilityPlus(), { duration: agi_duration, value: fOverflow * agi_per_overflow * 0.01 })
            }

            sTalentName = "special_bonus_unique_antimage_custom_3"
            let damage_per_mana = hCaster.HasTalent(sTalentName) && this.damage_per_burn + hCaster.GetTalentValue(sTalentName) || this.damage_per_burn
            let fDamage = total_burn_mana * this.damage_per_burn * 0.01 + (hTarget.GetMaxMana() - hTarget.GetMana()) * damage_per_mana

            modifier_antimage_1_max_mana_particle_generic_manaburn.apply(hTarget, hCaster, this.GetAbilityPlus(), { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

            EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Antimage.ManaBreak", hCaster), hCaster)
            // 魔晶
            if (hCaster.HasShard() && hTarget.GetMana() <= 0) {
                if (GFuncMath.PRD(this.shard_trigger_chance, hCaster, "modifier_antimage_1")) {
                    let hAbility3 = ability6_antimage_mana_void.findIn(hCaster)
                    if (GFuncEntity.IsValid(hAbility3) && hAbility3.GetLevel() >= 1) {
                        hAbility3.OnSpellStart()
                    }
                }
            }
            return fDamage
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_antimage_1_buff extends BaseModifier_Plus {
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
        if (IsServer()) {
            let fValue = params.value || 0
            this.changeStackCount(fValue)
            this.addTimer(params.duration, () => {
                this.changeStackCount(-fValue)
            })
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_tooltip() {
        return this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(params: IModifierTable) {
        return this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_antimage_1_max_mana extends BaseModifier_Plus {
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
        if (IsServer()) {
            let fValue = params.value || 0
            this.changeStackCount(fValue)
            this.addTimer(params.duration, () => {
                this.changeStackCount(-fValue)
            })
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    CC_GetModifierManaBonus(params: IModifierTable) {
        return this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_antimage_1_max_mana_particle_generic_manaburn extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/generic_gameplay/generic_manaburn.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hParent
            });
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
