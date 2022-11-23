
import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { ability1_slardar_sprint } from "./ability1_slardar_sprint";

/** dota原技能数据 */
export const Data_slardar_slithereen_crush = { "ID": "5115", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "FightRecapLevel": "1", "AbilitySound": "Hero_Slardar.Slithereen_Crush", "HasScepterUpgrade": "1", "HasShardUpgrade": "1", "AbilityCastRange": "0", "AbilityCastPoint": "0.35 0.35 0.35 0.35", "AbilityCooldown": "8", "AbilityDamage": "80 140 200 260", "AbilityManaCost": "90 100 110 120", "AbilityModifierSupportValue": "0.5", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "crush_radius": "350" }, "02": { "var_type": "FIELD_INTEGER", "crush_extra_slow": "-20 -25 -30 -35" }, "03": { "var_type": "FIELD_INTEGER", "crush_attack_slow_tooltip": "-20 -25 -30 -35" }, "04": { "var_type": "FIELD_FLOAT", "crush_extra_slow_duration": "3 4 5 6" }, "05": { "var_type": "FIELD_FLOAT", "stun_duration": "1", "LinkedSpecialBonus": "special_bonus_unique_slardar" }, "06": { "var_type": "FIELD_FLOAT", "puddle_duration": "25", "RequiresScepter": "1" }, "07": { "var_type": "FIELD_INTEGER", "puddle_radius": "600", "RequiresScepter": "1" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_slardar_slithereen_crush extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "slardar_slithereen_crush";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_slardar_slithereen_crush = Data_slardar_slithereen_crush;
    Init() {
        this.SetDefaultSpecialValue("chance", [10, 14, 18, 22, 30, 38]);
        this.SetDefaultSpecialValue("bonus_damage", [1000, 1400, 1800, 2200, 2600, 3000]);
        this.SetDefaultSpecialValue("bonus_physical_damage", [5, 10, 15, 20, 25, 30]);
        this.SetDefaultSpecialValue("duration", 1);

    }

    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        let sTalentName = "special_bonus_unique_slardar_custom_5"
        return hCaster.HasTalent(sTalentName) && 0 || super.GetCooldown(iLevel)
    }

    GetIntrinsicModifierName() {
        return "modifier_slardar_2"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_slardar_2 extends BaseModifier_Plus {
    duration: number;
    chance: number;
    bonus_damage: number;
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
    Init(params: ModifierTable) {
        this.duration = this.GetSpecialValueFor("duration")
        this.chance = this.GetSpecialValueFor("chance")
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage")
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PHYSICAL)
    GetProcAttack_BonusDamage_Physical(params: ModifierAttackEvent) {
        let hAttacker = params.attacker as BaseNpc_Plus
        let hAbility = this.GetAbilityPlus()
        let target = params.target as BaseNpc_Plus
        if (GameFunc.IsValid(hAbility) &&
            !hAttacker.IsIllusion() &&
            hAbility.IsCooldownReady() &&
            !hAttacker.PassivesDisabled() &&
            !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS) && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, hAttacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
            if (GameFunc.mathUtil.PRD(this.chance, hAttacker, "slardar_2")) {
                EmitSoundOnLocationWithCaster(params.target.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Slardar.Bash", hAttacker), hAttacker)
                let stun_duration = this.duration * target.GetStatusResistanceFactor(hAttacker)
                // 1技能水洼提升眩晕时间效果
                let hAbility1 = ability1_slardar_sprint.findIn(hAttacker)
                if (GameFunc.IsValid(hAbility1) && hAbility1.GetIncreasedStunDuration) {
                    stun_duration = stun_duration * hAbility1.GetIncreasedStunDuration(params.target)
                }
                modifier_slardar_2_bashed.apply(params.target, hAttacker, this.GetAbilityPlus(), { duration: stun_duration })
                let sTalentName = "special_bonus_unique_slardar_custom_3"
                if (hAttacker.HasTalent(sTalentName)) {
                    modifier_slardar_2_talent_attackspeed.apply(hAttacker, hAttacker, this.GetAbilityPlus(), null)
                }
                hAbility.UseResources(false, false, true)
                sTalentName = "special_bonus_unique_slardar_custom_8"
                let bonus_damage = hAttacker.HasTalent(sTalentName) && this.bonus_damage + hAttacker.GetTalentValue(sTalentName) || this.bonus_damage
                return bonus_damage
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_slardar_2_bashed extends BaseModifier_Plus {
    bonus_physical_damage: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return true
    }
    IsStunDebuff() {
        return true
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: ModifierTable) {
        this.bonus_physical_damage = this.GetSpecialValueFor("bonus_physical_damage")
        if (params.IsOnCreated && IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/generic_gameplay/generic_bashed.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }

    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_DISABLED
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    tooltip() {
        return this.bonus_physical_damage
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_PHYSICAL_DAMAGE_PERCENTAGE)
    G_INCOMING_PHYSICAL_DAMAGE_PERCENTAGE() {
        return this.bonus_physical_damage
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_slardar_2_talent_attackspeed extends BaseModifier_Plus {
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
    Init(params: ModifierTable) {
        let sTalentName = "special_bonus_unique_slardar_custom_3"
        if (IsServer()) {
            this.SetStackCount(this.GetCasterPlus().GetTalentValue(sTalentName) - 1)
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant(params: ModifierTable) {
        if (IsServer() && this.GetStackCount() >= 1) {
            return 9999
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    attack(params: ModifierAttackEvent) {
        if (IsServer()) {
            if (params.attacker == this.GetParentPlus() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS)) {
                if (!BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)) {
                    this.SetStackCount(this.GetStackCount() - 1)
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    attackLanded(params: ModifierAttackEvent) {
        if (!BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS)) {
            if (!BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)) {
                if (this.GetStackCount() == 0) {
                    this.Destroy()
                }
            }
        }
    }

}
