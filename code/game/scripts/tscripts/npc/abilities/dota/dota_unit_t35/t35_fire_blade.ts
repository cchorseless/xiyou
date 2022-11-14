import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { EntityHelper } from "../../../../helper/EntityHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { BaseNpc_Hero_Plus } from "../../../entityPlus/BaseNpc_Hero_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { modifier_shock } from "../../../modifier/effect/modifier_shock";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
import { modifier_particle, modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { LogHelper } from "../../../../helper/LogHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { GameEnum } from "../../../../GameEnum";


@registerAbility()
export class t35_fire_blade extends BaseAbility_Plus {

    GetIntrinsicModifierName() {
        return "modifier_t35_fire_blade"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
//  Modifiers
@registerModifier()
export class modifier_t35_fire_blade extends BaseModifier_Plus {
    max_stack_count: number;
    attack_bonus: number;
    splash_radius: number;
    splash_damage_pct: number;
    records: any[];
    damage_type: DAMAGE_TYPES;
    IsHidden() {
        return this.GetStackCount() == 0
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
        this.max_stack_count = this.GetSpecialValueFor("max_stack_count")
        this.attack_bonus = this.GetSpecialValueFor("attack_bonus")
        this.splash_radius = this.GetSpecialValueFor("splash_radius")
        this.splash_damage_pct = this.GetSpecialValueFor("splash_damage_pct")
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            this.records = []
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType()
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/econ/items/warlock/warlock_hellsworn_construct/golem_hellsworn_ambient.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_mane1", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_mane2", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 2, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_mane3", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 3, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_mane4", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 4, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_mane5", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 5, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_mane6", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 6, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_mane7", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 7, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_mane8", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 8, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_maneR", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 9, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_maneL", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 10, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hand_r", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 11, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hand_l", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 12, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_mouthFire", hParent.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    OnRefresh(params: ModifierTable) {
        super.OnRefresh(params);
        this.max_stack_count = this.GetSpecialValueFor("max_stack_count")
        this.attack_bonus = this.GetSpecialValueFor("attack_bonus")
        this.splash_radius = this.GetSpecialValueFor("splash_radius")
        this.splash_damage_pct = this.GetSpecialValueFor("splash_damage_pct")
        if (IsServer()) {
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType()
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    On_AttackStart(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            if (this.GetStackCount() >= this.max_stack_count && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                modifier_t35_fire_blade_cannot_miss.apply(params.attacker, params.attacker, this.GetAbilityPlus(), null)
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    On_AttackRecord(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }

        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            if (modifier_t35_fire_blade_cannot_miss.exist(params.attacker)) {
                table.insert(this.records, params.record)
            }
            modifier_t35_fire_blade_cannot_miss.remove(params.attacker);
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: ModifierAttackEvent) {
        if (IsServer() && params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            if (this.records.indexOf(params.record) != -1) {
                return this.attack_bonus
            }
        } else {
            if (this.GetStackCount() >= this.max_stack_count) {
                return this.attack_bonus
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    On_Attack(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }

        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            if (this.records.indexOf(params.record) != -1) {
                this.SetStackCount(0)
                return
            }
            this.IncrementStackCount()
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }

        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            if (this.records.indexOf(params.record) != -1) {
                modifier_t35_particle_atk.apply(this.GetParentPlus(), params.target, this.GetAbilityPlus(), { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

                let tTargets = AoiHelper.FindEntityInRadius(params.attacker.GetTeamNumber(), params.target.GetAbsOrigin(), this.splash_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST)
                for (let hTarget of (tTargets)) {


                    if (hTarget != params.target) {
                        let tDamageTable = {
                            ability: this.GetAbilityPlus(),
                            attacker: params.attacker,
                            victim: hTarget,
                            damage: params.damage * this.splash_damage_pct * 0.01,
                            damage_type: this.damage_type
                        }
                        BattleHelper.GoApplyDamage(tDamageTable)
                    }
                }
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
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t35_fire_blade_cannot_miss extends BaseModifier_Plus {
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
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_CANNOT_MISS]: true
        }
    }
}

// 特效
@registerModifier()
export class modifier_t35_particle_atk extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let splash_radius = this.GetSpecialValueFor("splash_radius")
        if (IsClient()) {
            let caster = this.GetCasterPlus()
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_jakiro/jakiro_liquid_fire_explosion.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, caster.GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(splash_radius, splash_radius, splash_radius))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}