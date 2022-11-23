
import { GameEnum } from "../../../../shared/GameEnum";
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
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_luna_moon_glaive = { "ID": "5223", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "AbilitySound": "Hero_Luna.MoonGlaive.Impact", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "range": "500" }, "02": { "var_type": "FIELD_INTEGER", "bounces": "3 4 5 6" }, "03": { "var_type": "FIELD_INTEGER", "damage_reduction_percent": "50 44 38 32" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_luna_moon_glaive extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "luna_moon_glaive";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_luna_moon_glaive = Data_luna_moon_glaive;
    Init() {
        this.SetDefaultSpecialValue("range", 500);
        this.SetDefaultSpecialValue("bounces", [2, 3, 4, 5, 6, 7]);

    }

    OnProjectileHit_ExtraData(hTarget: BaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        let caster = this.GetCasterPlus()
        let hashtable = HashTableHelper.GetHashtableByIndex(ExtraData.hashtable_index)
        let modifier = modifier_luna_2.findIn(caster)
        if (GameFunc.IsValid(modifier)) {
            if (this.GetCasterPlus().HasTalent("special_bonus_unique_luna_custom_2")) {
                let damage_increase_percent = this.GetCasterPlus().GetTalentValue("special_bonus_unique_luna_custom_2")
                modifier.damage_percent = math.pow(1 + damage_increase_percent * 0.01, hashtable.count) * 100
            }

            if (hTarget != null) {
                if (UnitFilter(hTarget, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, caster.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                    let iAttackState = BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NEVERMISS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING
                    iAttackState = caster.HasTalent("special_bonus_unique_luna_custom_7") && iAttackState - BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB - BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS || iAttackState
                    iAttackState = caster.HasTalent("special_bonus_unique_luna_custom_7") && iAttackState - BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB - BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS || iAttackState
                    BattleHelper.Attack(caster, hTarget, iAttackState)
                }
                table.insert(hashtable.targets, hTarget)
            }
            modifier.damage_percent = null
        }


        if (hashtable.max_count > hashtable.count) {
            let range = this.GetSpecialValueFor("range")
            let target = AoiHelper.GetBounceTarget([hTarget], caster.GetTeamNumber(), range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, vLocation, FindOrder.FIND_CLOSEST, true)
            if (target != null) {
                hashtable.count = hashtable.count + 1
                let info: CreateTrackingProjectileOptions = {
                    Source: hTarget,
                    Ability: this,
                    EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_luna/luna_moon_glaive_bounce.vpcf", caster),
                    iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION,
                    vSourceLoc: vLocation,
                    iMoveSpeed: 900,
                    Target: target,
                    flExpireTime: GameRules.GetGameTime() + 10.0,
                    ExtraData: {
                        hashtable_index: HashTableHelper.GetHashtableIndex(hashtable)
                    }
                }
                ProjectileManager.CreateTrackingProjectile(info)
                return true
            }
        }
        HashTableHelper.RemoveHashtable(hashtable)
    }
    //     GetIntrinsicModifierName() {
    //         return "modifier_luna_2"
    //     }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_luna_2 extends BaseModifier_Plus {
    range: number;
    bounces: number;
    damage_percent: any;
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
        return -1
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_luna/luna_ambient_moon_glaive.vpcf",
                resNpc: this.GetParentPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControlEnt(particleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_weapon", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }
    Init(params: ModifierTable) {
        this.range = this.GetSpecialValueFor("range")
        this.bounces = this.GetSpecialValueFor("bounces")
    }


    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PROJECTILE_NAME)
    GetProjectileName(params: ModifierTable) {
        return ResHelper.GetParticleReplacement("particles/units/heroes/hero_luna/luna_moon_glaive.vpcf", this.GetParentPlus())
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK) && !this.GetParentPlus().PassivesDisabled()) {
            let hashtable = HashTableHelper.CreateHashtable()
            hashtable.targets = [params.target]
            let target = AoiHelper.GetBounceTarget([params.target], params.attacker.GetTeamNumber(), this.range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, params.target.GetAbsOrigin(), FindOrder.FIND_CLOSEST, true)
            if (target != null) {
                hashtable.count = 1
                hashtable.max_count = this.bounces
                let info: CreateTrackingProjectileOptions = {
                    Source: params.target,
                    Target: target,
                    Ability: this.GetAbilityPlus(),
                    EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_luna/luna_moon_glaive_bounce.vpcf", params.attacker),
                    iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION,
                    vSourceLoc: params.target.GetAttachmentOrigin(params.target.ScriptLookupAttachment("attach_hitloc")),
                    iMoveSpeed: 900,
                    flExpireTime: GameRules.GetGameTime() + 10.0,
                    ExtraData: {
                        hashtable_index: HashTableHelper.GetHashtableIndex(hashtable)
                    }
                }
                ProjectileManager.CreateTrackingProjectile(info)
            } else {
                HashTableHelper.RemoveHashtable(hashtable)
            }
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage(params: ModifierTable) {
        if (params.target == null) {
            return
        }
        if (this.damage_percent != null) {
            return this.damage_percent - 100
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TRANSLATE_ATTACK_SOUND)
    Get_AttackSound() {
        if (this.damage_percent != null) {
            return ResHelper.GetSoundReplacement("Hero_Luna.MoonGlaive.Impact", this.GetParentPlus())
        }
    }
}
