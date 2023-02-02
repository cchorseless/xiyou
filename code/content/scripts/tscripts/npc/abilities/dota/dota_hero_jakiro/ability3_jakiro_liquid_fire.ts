import { GameFunc } from "../../../../GameFunc";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
/** dota原技能数据 */
export const Data_jakiro_liquid_fire = { "ID": "5299", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AUTOCAST | DOTA_ABILITY_BEHAVIOR_ATTACK", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC | DOTA_UNIT_TARGET_BUILDING", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES | DOTA_UNIT_TARGET_FLAG_DEAD", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "Hero_Jakiro.LiquidFire", "AbilityCooldown": "20 15 10 4", "AbilityDuration": "5.0", "AbilityCastRange": "600", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityModifierSupportBonus": "35", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "slow_attack_speed_pct": "-30 -40 -50 -60", "LinkedSpecialBonus": "special_bonus_unique_jakiro_4" }, "02": { "var_type": "FIELD_INTEGER", "radius": "300" }, "03": { "var_type": "FIELD_INTEGER", "damage": "12 16 20 24", "LinkedSpecialBonus": "special_bonus_unique_jakiro_8" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_jakiro_liquid_fire extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "jakiro_liquid_fire";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_jakiro_liquid_fire = Data_jakiro_liquid_fire;
    Init() {
        this.SetDefaultSpecialValue("status_resistance", [30, 40, 50, 60, 80]);
        this.SetDefaultSpecialValue("radius", 300);
        this.SetDefaultSpecialValue("damage_int_factor", [0.8, 1, 1.5, 2, 3]);
        this.SetDefaultSpecialValue("duration", 5);
        this.SetDefaultSpecialValue("burn_interval", 0.5);
        this.SetDefaultSpecialValue("shard_ice_damage_pct", 250);

    }



    // GetIntrinsicModifierName() {
    //     return "modifier_jakiro_3"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_jakiro_3 extends BaseModifier_Plus {
    radius: number;
    records: any[];
    duration: number;
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
        let hCaster = this.GetCasterPlus()
        if (IsServer()) {
            this.records = []
        }
    }
    Init(params: IModifierTable) {
        this.radius = this.GetSpecialValueFor("radius")
        this.duration = this.GetSpecialValueFor("duration")
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
            modifier_jakiro_3_projectile.apply(params.attacker, params.attacker, this.GetAbilityPlus(), null)
            params.attacker.AddActivityModifier("liquid_fire")
            if (this.GetParentPlus().HasShard()) {
                params.attacker.AddActivityModifier("liquid_ice")
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    On_Attack(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            let info = {
                Ability: this.GetAbilityPlus(),
                EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_jakiro/jakiro_base_attack_fire.vpcf", params.attacker),
                vSourceLoc: params.attacker.GetAttachmentOrigin(params.attacker.ScriptLookupAttachment("attach_attack2")),
                iMoveSpeed: params.attacker.GetProjectileSpeed(),
                Target: params.target
            }
            ProjectileManager.CreateTrackingProjectile(info)
            if (this.GetParentPlus().HasShard()) {
                info.EffectName = ResHelper.GetParticleReplacement("particles/units/heroes/hero_jakiro/jakiro_liquid_ice_projectile.vpcf", params.attacker)
                info.vSourceLoc = params.attacker.GetAttachmentOrigin(params.attacker.ScriptLookupAttachment("attach_attack1"))
                ProjectileManager.CreateTrackingProjectile(info)
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    On_AttackRecord(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            if (modifier_jakiro_3_projectile.exist(params.attacker)) {
                table.insert(this.records, params.record)
            }
            modifier_jakiro_3_projectile.remove(params.attacker);
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK) && !this.GetParentPlus().PassivesDisabled()) {
            if (this.records.indexOf(params.record) != -1) {
                // 液态火
                let iParticleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_jakiro/jakiro_liquid_fire_explosion.vpcf",
                    resNpc: this.GetParentPlus(),
                    iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                    owner: params.target
                });

                ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.radius, this.radius, this.radius))
                ParticleManager.ReleaseParticleIndex(iParticleID)
                this.GetParentPlus().EmitSound(ResHelper.GetSoundReplacement("Hero_Jakiro.LiquidFire", this.GetParentPlus()))
                let tTarget = FindUnitsInRadius(params.attacker.GetTeamNumber(), params.target.GetAbsOrigin(), null, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
                for (let hTarget of (tTarget)) {

                    modifier_jakiro_3_burn_debuff.apply(hTarget, params.attacker, this.GetAbilityPlus(), { duration: this.duration })
                }
                // 液态冰
                if (this.GetParentPlus().HasShard()) {
                    let iParticleID = ResHelper.CreateParticle({
                        resPath: "particles/units/heroes/hero_jakiro/jakiro_liquid_ice.vpcf",
                        resNpc: this.GetParentPlus(),
                        iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                        owner: params.target
                    });

                    ParticleManager.SetParticleControl(iParticleID, 2, Vector(this.radius, this.radius, this.radius))
                    ParticleManager.ReleaseParticleIndex(iParticleID)
                    let tTarget = FindUnitsInRadius(params.attacker.GetTeamNumber(), params.target.GetAbsOrigin(), null, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
                    for (let hTarget of (tTarget)) {

                        modifier_jakiro_3_ice_debuff.apply(hTarget, params.attacker, this.GetAbilityPlus(), { duration: this.duration })
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_jakiro_3_projectile extends BaseModifier_Plus {
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
        return modifierpriority.MODIFIER_PRIORITY_HIGH
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_NAME)
    GetProjectileName(params: IModifierTable) {
        return "maps/reef_assets/particles/reef_effects_creep_null.vpcf"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_jakiro_3_burn_debuff extends BaseModifier_Plus {
    damage_int_factor: number;
    status_resistance: number;
    burn_interval: number;
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
    GetEffectName() {
        return "particles/units/heroes/hero_jakiro/jakiro_liquid_fire_debuff.vpcf"
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(this.burn_interval)
        }
    }
    Init(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.damage_int_factor = this.GetSpecialValueFor("damage_int_factor")
        this.burn_interval = this.GetSpecialValueFor("burn_interval")
        this.status_resistance = this.GetSpecialValueFor("status_resistance") + hCaster.GetTalentValue("special_bonus_unique_jakiro_custom_4")
    }
    OnIntervalThink() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            if (!GameFunc.IsValid(hCaster) || !hCaster.IsAlive()) {
                this.Destroy()
                return
            }
            let fDamage = hCaster.GetIntellect() * this.damage_int_factor
            let damage_table =
            {
                ability: this.GetAbilityPlus(),
                attacker: hCaster,
                victim: hParent,
                damage: fDamage * this.burn_interval,
                damage_type: this.GetAbilityPlus().GetAbilityDamageType()
            }
            BattleHelper.GoApplyDamage(damage_table)
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    G_STATUS_RESISTANCE_STACKING() {
        return -this.status_resistance
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)

    On_Tooltip() {
        return this.status_resistance
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_jakiro_3_ice_debuff extends BaseModifier_Plus {
    shard_ice_damage_pct: number;
    burn_interval: number;
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
    GetTexture() {
        return "jakiro_liquid_ice"
    }
    //   GetEffectName() {
    //  	return "particles/units/heroes/hero_jakiro/jakiro_liquid_ice_ready.vpcf"
    //  }
    //   GetEffectAttachType() {
    //  	return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    //  }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        this.shard_ice_damage_pct = this.GetSpecialValueFor("shard_ice_damage_pct")
        this.burn_interval = this.GetSpecialValueFor("burn_interval")
        if (IsServer()) {
            this.StartIntervalThink(this.burn_interval)
        }
    }
    OnRefresh(params: IModifierTable) {
        super.OnRefresh(params);
        this.shard_ice_damage_pct = this.GetSpecialValueFor("shard_ice_damage_pct")
        this.burn_interval = this.GetSpecialValueFor("burn_interval")
    }

    OnIntervalThink() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            if (!GameFunc.IsValid(hCaster) || !hCaster.IsAlive()) {
                this.Destroy()
                return
            }
            let fDamage = hCaster.GetMaxMana() * this.shard_ice_damage_pct * 0.01
            let damage_table =
            {
                ability: this.GetAbilityPlus(),
                attacker: hCaster,
                victim: hParent,
                damage: fDamage * this.burn_interval,
                damage_type: this.GetAbilityPlus().GetAbilityDamageType()
            }
            BattleHelper.GoApplyDamage(damage_table)
        }
    }
}
