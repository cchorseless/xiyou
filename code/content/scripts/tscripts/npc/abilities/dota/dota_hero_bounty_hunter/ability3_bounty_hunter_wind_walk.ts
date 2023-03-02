
import { GameFunc } from "../../../../GameFunc";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_bounty_hunter_1_caster } from "./ability1_bounty_hunter_shuriken_toss";

/** dota原技能数据 */
export const Data_bounty_hunter_wind_walk = { "ID": "5287", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilitySound": "Hero_BountyHunter.WindWalk", "HasShardUpgrade": "1", "AbilityCooldown": "15.0 15.0 15.0 15.0", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityManaCost": "65", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "20.0 25.0 30.0 35.0" }, "02": { "var_type": "FIELD_FLOAT", "fade_time": "1.0 0.75 0.5 0.25" }, "03": { "var_type": "FIELD_INTEGER", "slow": "16 24 32 40" }, "04": { "var_type": "FIELD_FLOAT", "slow_duration": "4" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_bounty_hunter_wind_walk extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "bounty_hunter_wind_walk";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_bounty_hunter_wind_walk = Data_bounty_hunter_wind_walk;
    Init() {
        this.SetDefaultSpecialValue("bonus_damage", [200, 600, 1000, 2000, 3000]);
        this.SetDefaultSpecialValue("gold_steal", [40, 50, 60, 70, 80]);
        this.SetDefaultSpecialValue("bonus_gold_steal_percent", 2);

    }





    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        if (hCaster.HasTalent("special_bonus_unique_bounty_hunter_custom_6")) {
            return 0
        }
        return super.GetCooldown(iLevel)
    }
    GetIntrinsicModifierName() {
        return "modifier_bounty_hunter_3"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
//  Modifiers
@registerModifier()
export class modifier_bounty_hunter_3 extends BaseModifier_Plus {
    bonus_damage: number;
    gold_steal: number;
    bonus_gold_steal_percent: number;
    records: any[];
    weaponEffectModifier1: CDOTA_Buff;
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
    Isbonus_damageDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    BeCreated(params: IModifierTable) {

        this.bonus_damage = this.GetSpecialValueFor("bonus_damage")
        this.gold_steal = this.GetSpecialValueFor("gold_steal")
        this.bonus_gold_steal_percent = this.GetSpecialValueFor("bonus_gold_steal_percent")
        if (IsServer()) {
            this.records = []
            this.StartIntervalThink(this.GetAbilityPlus().GetCooldownTimeRemaining())
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let parent = this.GetParentPlus()
            this.weaponEffectModifier1 = modifier_bounty_hunter_3_particle_bounty_hunter_hand_r.apply(parent, parent, this.GetAbilityPlus(), null)
            this.SetStackCount(1)
            this.StartIntervalThink(-1)
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    On_AttackRecord(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS)) {
            if (this.GetStackCount() == 1 || modifier_bounty_hunter_1_caster.exist((params.attacker)) && !params.attacker.IsIllusion() && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                table.insert(this.records, params.record)
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

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        if (IsServer() && params.attacker != null) {
            if (this.records.indexOf(params.record) != -1) {
                return this.bonus_damage + hCaster.GetTalentValue("special_bonus_unique_bounty_hunter_custom_3")
            }
        }
        if (IsClient()) {
            if (this.GetStackCount() == 1) {
                return this.bonus_damage + hCaster.GetTalentValue("special_bonus_unique_bounty_hunter_custom_3")
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
                let hAbility = this.GetAbilityPlus()
                let hCaster = params.attacker
                let hTarget = params.target

                EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_BountyHunter.Jinada", hCaster), hCaster)

                modifier_bounty_hunter_3_particle_bounty_hunter_jinda_slow.apply(hCaster, hTarget, hAbility, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

                // if (!Spawner.IsEndless()) {
                //     let iPlayerID = hCaster.GetPlayerOwnerID()
                //     let extra_gold_steal = hCaster.HasTalent("special_bonus_unique_bounty_hunter_custom") && hCaster.GetTalentValue("special_bonus_unique_bounty_hunter_custom") || 0
                //     let gold_steal = this.gold_steal + extra_gold_steal
                //     gold_steal = gold_steal + math.ceil(params.original_damage * this.bonus_gold_steal_percent * 0.01)
                //     let track_bounty  = modifier_bounty_hunter_track_bounty.findIn(  hCaster )
                //     if (GFuncEntity.IsValid(track_bounty) && type(track_bounty.AddTotalGold) == "function") {
                //         track_bounty.AddTotalGold(gold_steal)
                //     }
                //     // let actual = Clamp(gold_steal, 0, math.max(PlayerData.GetMaxGold(iPlayerID) - PlayerData.GetGold(iPlayerID), 0))
                //     // PlayerData.ModifyGold(iPlayerID, actual, true)
                //     SendOverheadEventMessage(hCaster.GetPlayerOwner(), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_GOLD, hTarget, gold_steal, null)
                // }

                if (!BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)) {
                    // if (GFuncEntity.IsValid(this.weaponEffectModifier1)) {
                    //     this.weaponEffectModifier1.Destroy()
                    // }

                    this.SetStackCount(0)
                    hAbility.UseResources(true, true, true)
                    this.StartIntervalThink(hAbility.GetCooldownTimeRemaining())
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_bounty_hunter_3_particle_bounty_hunter_jinda_slow extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_bounty_hunter/bounty_hunter_jinda_slow.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 2, hParent, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_bounty_hunter/bounty_hunter_jinada.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_bounty_hunter_3_particle_bounty_hunter_hand_r extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_bounty_hunter/bounty_hunter_hand_r.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_weapon1", hCaster.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_bounty_hunter/bounty_hunter_hand_l.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_weapon2", hCaster.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
}
