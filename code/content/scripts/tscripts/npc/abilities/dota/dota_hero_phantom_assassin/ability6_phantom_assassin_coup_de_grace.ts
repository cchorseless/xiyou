
import { GameFunc } from "../../../../GameFunc";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_phantom_assassin_1_caster } from "./ability1_phantom_assassin_stifling_dagger";
import { modifier_phantom_assassin_3_blur_attack } from "./ability3_phantom_assassin_blur";

/** dota原技能数据 */
export const Data_phantom_assassin_coup_de_grace = { "ID": "5193", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "AbilitySound": "Hero_PhantomAssassin.CoupDeGrace", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityDraftUltShardAbility": "phantom_assassin_fan_of_knives", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "crit_chance": "15", "LinkedSpecialBonus": "special_bonus_unique_phantom_assassin_2" }, "02": { "var_type": "FIELD_INTEGER", "crit_bonus": "200 325 450", "LinkedSpecialBonus": "special_bonus_unique_phantom_assassin_4" } } };

@registerAbility()
export class ability6_phantom_assassin_coup_de_grace extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "phantom_assassin_coup_de_grace";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_phantom_assassin_coup_de_grace = Data_phantom_assassin_coup_de_grace;
    Init() {
        this.SetDefaultSpecialValue("crit_chance", 30);
        this.SetDefaultSpecialValue("crit_damage", [350, 400, 450, 500, 550, 600]);
        this.SetDefaultSpecialValue("max_stack", 5);
        this.SetDefaultSpecialValue("crit_chance_stack", 10);
        this.SetDefaultSpecialValue("crit_damage_stack", [50, 54, 58, 62, 66, 70]);
        this.SetDefaultSpecialValue("blur_count", 5);
        this.SetDefaultSpecialValue("blur_duration", 5);
        this.SetDefaultSpecialValue("cooldown_reduce_scepter", 2);

    }

    Init_old() {
        this.SetDefaultSpecialValue("crit_chance", 30);
        this.SetDefaultSpecialValue("crit_damage", [350, 400, 450, 500, 550, 600]);
        this.SetDefaultSpecialValue("max_stack", 5);
        this.SetDefaultSpecialValue("crit_chance_stack", 10);
        this.SetDefaultSpecialValue("crit_damage_stack", [50, 52, 54, 56, 58, 60]);
        this.SetDefaultSpecialValue("blur_count", 5);
        this.SetDefaultSpecialValue("blur_duration", 5);
        this.SetDefaultSpecialValue("cooldown_reduce_scepter", 2);

    }



    GetIntrinsicModifierName() {
        return "modifier_phantom_assassin_6"
    }


}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_phantom_assassin_6 extends BaseModifier_Plus {
    crit_chance: number;
    crit_damage: number;
    crit_chance_stack: number;
    cooldown_reduce_scepter: number;
    records: number[];
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
        this.crit_chance = this.GetSpecialValueFor("crit_chance")
        this.crit_damage = this.GetSpecialValueFor("crit_damage")
        this.crit_chance_stack = this.GetSpecialValueFor("crit_chance_stack")
        this.cooldown_reduce_scepter = this.GetSpecialValueFor("cooldown_reduce_scepter")
        if (params.IsOnCreated && IsServer()) {
            this.records = []
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    attackRecord(params: ModifierAttackEvent) {
        let hParent = this.GetParentPlus()
        let hTarget = params.target
        if (hTarget == null || hTarget.GetClassname() == "dota_item_drop" || params.attacker != hParent || hParent.PassivesDisabled() || UnitFilter(hTarget, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, hParent.GetTeamNumber()) != UnitFilterResult.UF_SUCCESS) {
            return
        }
        let chance = this.crit_chance
        let stack_modifier = modifier_phantom_assassin_6_stack.findIn(hParent)
        if (stack_modifier) {
            chance = chance + stack_modifier.GetStackCount() * this.crit_chance_stack
        }
        if (GFuncMath.PRD(chance, params.attacker, "phantom_assassin_3") || modifier_phantom_assassin_3_blur_attack.exist(hParent)) {
            table.insert(this.records, params.record)
        } else {
            modifier_phantom_assassin_6_stack.remove(hParent);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE)
    CC_GetModifierCriticalStrike(params: ModifierAttackEvent) {
        if (this.records.indexOf(params.record) != -1) {
            return this.crit_damage
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    attackLanded(params: ModifierAttackEvent) {
        let hParent = this.GetParentPlus()
        let hTarget = params.target
        if (hTarget == null || hTarget.GetClassname() == "dota_item_drop" || params.attacker != hParent || this.records.indexOf(params.record) != -1) {
            return
        }
        modifier_phantom_assassin_6_stack.apply(hParent, hParent, this.GetAbilityPlus(), {})
        // 优先消耗模糊必定暴击效果
        let blur_attack_modifier = modifier_phantom_assassin_3_blur_attack.findIn(hParent)
        if (blur_attack_modifier) {
            blur_attack_modifier.DecrementStackCount()
        }

        let vDirection = GFuncVector.HorizonVector((params.attacker.GetAbsOrigin() - params.target.GetAbsOrigin()) as Vector)
        modifier_phantom_assassin_6_particle_phantom_assassin_crit_impact_dagger.apply(params.attacker, params.target, this.GetAbilityPlus(), { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
        EmitSoundOnLocationWithCaster(params.target.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_PhantomAssassin.CoupDeGrace", params.attacker), params.attacker)
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY)
    attackRecordDestroy(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus()) {
            GameFunc.ArrayFunc.ArrayRemove(this.records, params.record)
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    death(params: IModifierTable) {
        let hAttacker = params.attacker
        if (!IsServer() || !GFuncEntity.IsValid(hAttacker) || hAttacker.GetTeamNumber() == params.unit.GetTeamNumber() || hAttacker == null || hAttacker.GetUnitLabel() == "builder" || hAttacker != this.GetParentPlus() || !hAttacker.HasScepter() || hAttacker.IsIllusion()) {
            return
        }
        hAttacker = hAttacker.GetSource()
        // 所有技能都冷却
        for (let i = 0; i <= hAttacker.GetAbilityCount() - 1, 1; i++) {
            let hAbility = hAttacker.GetAbilityByIndex(i)
            if (hAbility && !hAbility.IsPassive() && !hAbility.IsCooldownReady()) {
                //  hAbility.BaseClass.ReduceCooldown(hAbility, this.cooldown_reduce_scepter)
                let fCooldownTime = hAbility.GetCooldownTimeRemaining()
                hAbility.EndCooldown()
                fCooldownTime = fCooldownTime - this.cooldown_reduce_scepter
                if (fCooldownTime > 0) {
                    hAbility.StartCooldown(fCooldownTime)
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_phantom_assassin_6_stack// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_phantom_assassin_6_stack extends BaseModifier_Plus {
    max_stack: number;
    crit_chance_stack: number;
    crit_damage_stack: number;
    IsHidden() {
        return false
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
        this.max_stack = this.GetSpecialValueFor("max_stack") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_phantom_assassin_custom_7")
        this.crit_chance_stack = this.GetSpecialValueFor("crit_chance_stack")
        this.crit_damage_stack = this.GetSpecialValueFor("crit_damage_stack")
        if (IsServer()) {
            if (this.GetStackCount() < this.max_stack) {
                this.IncrementStackCount()
            }
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE_DAMAGE)
    G_CRITICALSTRIKE_DAMAGE() {
        return this.crit_damage_stack * this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_tooltip() {
        return this.crit_chance_stack * this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2)
    CC_tooltip2() {
        return this.crit_damage_stack * this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_phantom_assassin_6_particle_phantom_assassin_crit_impact_dagger extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let vDirection = GFuncVector.HorizonVector((hParent.GetAbsOrigin() - hCaster.GetAbsOrigin()) as Vector)
            let sParticlePath = modifier_phantom_assassin_1_caster.exist(hParent) && "particles/units/heroes/hero_phantom_assassin/phantom_assassin_crit_impact_dagger.vpcf" || "particles/units/heroes/hero_phantom_assassin/phantom_assassin_crit_impact.vpcf"
            let iParticleID = ResHelper.CreateParticle({
                resPath: sParticlePath,
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 1, hCaster.GetAbsOrigin())
            ParticleManager.SetParticleControlForward(iParticleID, 1, vDirection.Normalized())
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }


}
