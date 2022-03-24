import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../modifier/modifier_event";
import { modifier_knockback } from "../../../modifier/modifier_knockback";
import { modifier_sniper_1_debuff } from "./ability1_sniper_shrapnel";

/** dota原技能数据 */
export const Data_sniper_headshot = { "ID": "5155", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "AbilityDamage": "20 50 80 110", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "slow_duration": "0.5" }, "02": { "var_type": "FIELD_INTEGER", "proc_chance": "40" }, "03": { "var_type": "FIELD_INTEGER", "knockback_distance": "10", "LinkedSpecialBonus": "special_bonus_unique_sniper_3" }, "04": { "var_type": "FIELD_INTEGER", "slow": "-100" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_sniper_headshot extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "sniper_headshot";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_sniper_headshot = Data_sniper_headshot;
    Init() {
        this.SetDefaultSpecialValue("damage", [1000, 2000, 3000, 4000, 5000, 6000]);
        this.SetDefaultSpecialValue("proc_chance", 30);
        this.SetDefaultSpecialValue("stun_duration", 0.5);
        this.SetDefaultSpecialValue("knockback_distance", 75);
        this.SetDefaultSpecialValue("scepter_extra_damage_per", 600);
        this.SetDefaultSpecialValue("scepter_radius", 350);

    }

    Init_old() {
        this.SetDefaultSpecialValue("damage", [1000, 2000, 3000, 4000, 5000, 6000]);
        this.SetDefaultSpecialValue("proc_chance", 30);
        this.SetDefaultSpecialValue("stun_duration", 0.5);
        this.SetDefaultSpecialValue("knockback_distance", 75);
        this.SetDefaultSpecialValue("scepter_extra_damage_per", 350);
        this.SetDefaultSpecialValue("scepter_radius", 350);

    }



    GetIntrinsicModifierName() {
        return "modifier_sniper_2"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_sniper_2 extends BaseModifier_Plus {
    damage: number;
    proc_chance: number;
    scepter_extra_damage_per: number;
    stun_duration: number;
    scepter_radius: number;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.records = []
        }
    }
    Init(params: ModifierTable) {
        this.damage = this.GetSpecialValueFor("damage")
        this.proc_chance = this.GetSpecialValueFor("proc_chance")
        this.stun_duration = this.GetSpecialValueFor("stun_duration")
        this.scepter_extra_damage_per = this.GetSpecialValueFor("scepter_extra_damage_per")
        this.scepter_radius = this.GetSpecialValueFor("scepter_radius")
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY)
    On_AttackRecordDestroy(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        GameFunc.ArrayFunc.ArrayRemove(this.records, params.record)
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    On_AttackStart(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (this.GetCasterPlus().PassivesDisabled()) {
            return
        }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            if (UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                if (GameFunc.mathUtil.PRD(this.proc_chance, params.attacker as BaseNpc_Plus, "sniper_2")) {
                    modifier_sniper_2_projectile.apply(params.attacker, params.attacker, this.GetAbilityPlus(), null)
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    On_AttackRecord(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (this.GetCasterPlus().PassivesDisabled()) {
            return
        }
        if (modifier_sniper_2_projectile.exist(params.attacker)) {
            modifier_sniper_2_projectile.remove(params.attacker);
            table.insert(this.records, params.record)
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (!GameFunc.IsValid(params.target) || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (this.records.indexOf(params.record) != null) {
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus()
            let attacker = params.attacker as BaseNpc_Plus
            EmitSoundOnLocationWithCaster(params.target.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Sniper.Headshot"), params.attacker)
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_sniper/sniper_headshot_slow_caster.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)

            let fDamage = this.damage
            if (attacker.GetAgility != null) {
                if (hCaster.HasTalent("special_bonus_unique_sniper_custom_6")) {
                    let damage_per_agi = hCaster.GetTalentValue("special_bonus_unique_sniper_custom_6")
                    fDamage = damage_per_agi * attacker.GetAgility() + fDamage
                }
            }
            if (hCaster.HasScepter()) {
                fDamage = fDamage + params.original_damage * this.scepter_extra_damage_per * 0.01
            }
            if (hCaster.HasTalent("special_bonus_unique_sniper_custom_5")) {
                if (modifier_sniper_1_debuff.exist(params.target)) {
                    fDamage = fDamage * 2
                }
            }
            if (hCaster.HasScepter()) {
                let targets = FindUnitsInRadius(hCaster.GetTeamNumber(), params.target.GetAbsOrigin(), hCaster, this.scepter_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST, false)
                for (let target of (targets)) {
                    if (GameFunc.IsValid(target) && target.IsAlive() && target != params.target) {
                        let tDamageTable = {
                            ability: hAbility,
                            attacker: params.attacker,
                            victim: target,
                            damage: fDamage,
                            damage_type: hAbility.GetAbilityDamageType(),
                            eom_flags: BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_NO_SPELL_CRIT,
                        }
                        BattleHelper.GoApplyDamage(tDamageTable)
                    }
                }
            }
            let tDamageTable = {
                ability: hAbility,
                attacker: params.attacker,
                victim: params.target,
                damage: fDamage,
                damage_type: hAbility.GetAbilityDamageType(),
                eom_flags: BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_NO_SPELL_CRIT,
            }
            BattleHelper.GoApplyDamage(tDamageTable)
            modifier_sniper_2_debuff.apply(params.target, hCaster, hAbility, { duration: this.stun_duration * (params.target as BaseNpc_Plus).GetStatusResistanceFactor(hCaster) })
            if (hCaster.HasTalent("special_bonus_unique_sniper_custom_2")) {
                let knockback_distance = hCaster.GetTalentValue("special_bonus_unique_sniper_custom_2")
                let vCenter = params.attacker.GetAbsOrigin()
                let modifierKnockback = {
                    center_x: vCenter.x,
                    center_y: vCenter.y,
                    center_z: vCenter.z,
                    should_stun: false,
                    duration: 0,
                    knockback_duration: 0.1,
                    knockback_distance: knockback_distance,
                    knockback_height: 0
                }
                modifier_knockback.apply(params.target, hCaster, hAbility, modifierKnockback)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_sniper_2_projectile extends BaseModifier_Plus {
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
        return ResHelper.GetParticleReplacement("particles/units/heroes/hero_sniper/sniper_headshot_attack.vpcf", this.GetCasterPlus())
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_sniper_2_debuff extends BaseModifier_Plus {
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_sniper/sniper_headshot_slow.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_FROZEN]: true,
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_DISABLED
    }

}
