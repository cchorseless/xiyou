
import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../modifier/modifier_event";
import { modifier_particle, modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { ability3_drow_ranger_multishot } from "./ability3_drow_ranger_multishot";
import { modifier_drow_ranger_6_projectile } from "./ability6_drow_ranger_marksmanship";

/** dota原技能数据 */
export const Data_drow_ranger_frost_arrows = { "ID": "5019", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AUTOCAST | DOTA_ABILITY_BEHAVIOR_ATTACK", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "Hero_DrowRanger.FrostArrows", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "HasShardUpgrade": "1", "AbilityCastRange": "625", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityCooldown": "0.0 0.0 0.0 0.0", "AbilityDuration": "1.5", "AbilityDamage": "0 0 0 0", "AbilityManaCost": "12 12 12 12", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "frost_arrows_movement_speed": "-10 -25 -40 -55" }, "02": { "var_type": "FIELD_INTEGER", "damage": "5 10 15 20" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_drow_ranger_frost_arrows extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "drow_ranger_frost_arrows";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_drow_ranger_frost_arrows = Data_drow_ranger_frost_arrows;
    Init() {
        this.SetDefaultSpecialValue("agility_multiplier", 1);
        this.SetDefaultSpecialValue("frost_arrows_movement_speed", [-10, -20, -30, -40, -50, -60]);
        this.SetDefaultSpecialValue("frost_arrows_duration", 4);
        this.SetDefaultSpecialValue("frost_arrows_burst_num", 10);
        this.SetDefaultSpecialValue("frost_arrows_burst_multi", [2, 2.4, 2.6, 2.8, 3.0, 3.2]);
        this.SetDefaultSpecialValue("frost_arrows_burst_radius", 300);

    }

    GetIntrinsicModifierName() {
        return modifier_drow_ranger_1.name
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_drow_ranger_1 extends BaseModifier_Plus {
    records: any[];
    agility_multiplier: number;
    frost_arrows_duration: number;
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
            this.records = []
        }
    }
    Init(params: ModifierTable) {
        this.agility_multiplier = this.GetSpecialValueFor("agility_multiplier")
        this.frost_arrows_duration = this.GetSpecialValueFor("frost_arrows_duration")
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
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    On_AttackStart(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            if ((this.GetParentPlus().GetCurrentActiveAbility() == this.GetAbilityPlus() ||
                this.GetAbilityPlus().GetAutoCastState()) &&
                !this.GetParentPlus().IsSilenced() &&
                this.GetAbilityPlus().IsCooldownReady() &&
                this.GetAbilityPlus().IsOwnersManaEnough() &&
                this.GetAbilityPlus().CastFilterResult() == UnitFilterResult.UF_SUCCESS) {
                if (!modifier_drow_ranger_1_projectile.exist(params.attacker)) {
                    modifier_drow_ranger_1_projectile.apply(params.attacker, params.attacker, this.GetAbilityPlus())
                }
            }
            else {
                modifier_drow_ranger_1_projectile.remove(params.attacker);
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    On_AttackRecord(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            if ((this.GetParentPlus().GetCurrentActiveAbility() == this.GetAbilityPlus() || this.GetAbilityPlus().GetAutoCastState()) && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS) && !this.GetParentPlus().IsSilenced() && this.GetAbilityPlus().IsCooldownReady() && this.GetAbilityPlus().IsOwnersManaEnough() && this.GetAbilityPlus().CastFilterResult() == UnitFilterResult.UF_SUCCESS) {
                table.insert(this.records, params.record)
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    On_Attack(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS)) {
            if (this.records.indexOf(params.record) != -1) {
                params.attacker.EmitSound(ResHelper.GetSoundReplacement("Hero_DrowRanger.FrostArrows", params.attacker))
                this.GetAbilityPlus().UseResources(true, true, true)
            }
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PHYSICAL)
    GetProcAttack_BonusDamage_Physical(params: ModifierAttackEvent) {
        if (!params.attacker.IsIllusion()) {
            if (this.records.indexOf(params.record) != -1) {
                modifier_drow_ranger_1_slow.apply(params.target, params.attacker, this.GetAbilityPlus(), { duration: this.frost_arrows_duration * (params.target as BaseNpc_Plus).GetStatusResistanceFactor(params.attacker) })
                modifier_drow_ranger_1_debuff.apply(params.target, params.attacker, this.GetAbilityPlus())
                return this.agility_multiplier * (params.attacker as BaseNpc_Plus).GetAgility()
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_drow_ranger_1_projectile extends BaseModifier_Plus {
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
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PROJECTILE_NAME)
    GetProjectileName(params: ModifierTable) {
        if (modifier_drow_ranger_6_projectile.exist(this.GetParentPlus())) {
            return ResHelper.GetParticleReplacement("particles/units/heroes/hero_drow/drow_marksmanship_frost_arrow.vpcf", this.GetCasterPlus())
        } else {
            return ResHelper.GetParticleReplacement("particles/units/heroes/hero_drow/drow_frost_arrow.vpcf", this.GetCasterPlus())
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_drow_ranger_1_slow extends BaseModifier_Plus {
    frost_arrows_movement_speed: number;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let iPtclID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_drow/drow_frost_arrow_debuff.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iPtclID, false, false, -1, false, false)
            iPtclID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_drow_frost_arrow.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iPtclID, false, true, 10, false, false)
        }
    }
    Init(params: ModifierTable) {
        this.frost_arrows_movement_speed = this.GetSpecialValueFor("frost_arrows_movement_speed")
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: ModifierTable) {
        return this.frost_arrows_movement_speed
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_drow_ranger_1_debuff// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_drow_ranger_1_debuff extends BaseModifier_Plus {
    frost_arrows_burst_num: number;
    frost_arrows_burst_multi: number;
    frost_arrows_burst_radius: number;
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
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.frost_arrows_burst_num = this.GetSpecialValueFor("frost_arrows_burst_num") + hCaster.GetTalentValue("special_bonus_unique_drow_ranger_custom_7")
        this.frost_arrows_burst_multi = this.GetSpecialValueFor("frost_arrows_burst_multi")
        this.frost_arrows_burst_radius = this.GetSpecialValueFor("frost_arrows_burst_radius")
        if (IsServer()) {
            this.IncrementStackCount()
        }
    }

    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let iStackCount = this.GetStackCount()
            if (!this.GetParentPlus().IsAlive() || iStackCount >= this.frost_arrows_burst_num) {
                this.Burst()
            }
        }
    }
    OnStackCountChanged(iStackCount: number) {
        if (IsServer()) {
            let iStackCount = this.GetStackCount()
            if (iStackCount >= this.frost_arrows_burst_num) {
                this.Destroy()
            }
        }
    }
    Burst() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        let iStackCount = this.GetStackCount()

        if (!GameFunc.IsValid(hCaster) || !GameFunc.IsValid(hAbility)) {
            return
        }
        modifier_drow_ranger_1_particle_lich_frost_nova.apply(hCaster, hParent, hAbility, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

        let sTalentName = "special_bonus_unique_drow_ranger_custom_7"
        let agility_multiplier = this.frost_arrows_burst_multi
        if (hCaster.HasTalent(sTalentName)) {
            agility_multiplier = agility_multiplier + hCaster.GetTalentValue(sTalentName)
        }
        let fDamage = 0
        if (hCaster.GetAgility) {
            fDamage = agility_multiplier * hCaster.GetAgility() * iStackCount
        }

        let duration = hCaster.GetTalentValue("special_bonus_unique_drow_ranger_custom_1")

        let hTargets = FindUnitsInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), null, this.frost_arrows_burst_radius, hAbility.GetAbilityTargetTeam(), hAbility.GetAbilityTargetType(), hAbility.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false)
        if (hTargets[0] != null) {
            for (let hTarget of (hTargets)) {
                if (hCaster.HasTalent("special_bonus_unique_drow_ranger_custom_1")) {
                    modifier_drow_ranger_1_root.apply(hTarget, hCaster, hAbility, { duration: duration * (hTarget as BaseNpc_Plus).GetStatusResistanceFactor(hCaster) })
                }
                BattleHelper.GoApplyDamage(
                    {
                        ability: hAbility,
                        attacker: hCaster,
                        victim: hTarget,
                        damage: fDamage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
                    }
                )
            }
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    EOM_GetModifierIncomingDamagePercentage(params: ModifierTable) {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            if (GameFunc.IsValid(hCaster)) {
                let hAbility = ability3_drow_ranger_multishot.findIn(hCaster)
                if (GameFunc.IsValid(hAbility) && hAbility.IsActivated() && hAbility.GetLevel() > 0) {
                    return this.GetStackCount() * hAbility.GetSpecialValueFor("increase_damage_pct")
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_drow_ranger_1_root// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_drow_ranger_1_root extends BaseModifier_Plus {
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
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let iPtclID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_crystalmaiden/maiden_frostbite_buff.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: this.GetEffectAttachType(),
                owner: this.GetParentPlus()
            });

            this.AddParticle(iPtclID, false, false, -1, false, false)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
@registerModifier()
export class modifier_drow_ranger_1_particle_lich_frost_nova extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        let frost_arrows_burst_radius = this.GetSpecialValueFor("frost_arrows_burst_radius")
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_lich/lich_frost_nova.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(iParticleID, 1, Vector(frost_arrows_burst_radius, frost_arrows_burst_radius, frost_arrows_burst_radius))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }

}
