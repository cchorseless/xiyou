
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_bleeding } from "../../../modifier/effect/modifier_bleeding";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { ability6_bristleback_warpath } from "./ability6_bristleback_warpath";

/** dota原技能数据 */
export const Data_bristleback_quill_spray = { "ID": "5549", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_Bristleback.QuillSpray", "AbilityCastAnimation": "ACT_INVALID", "AbilityCastRange": "650", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityCooldown": "3.0 3.0 3.0 3.0", "AbilityManaCost": "35 35 35 35", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "700" }, "02": { "var_type": "FIELD_FLOAT", "quill_base_damage": "25 45 65 85" }, "03": { "var_type": "FIELD_FLOAT", "quill_stack_damage": "28 30 32 34", "LinkedSpecialBonus": "special_bonus_unique_bristleback_2" }, "04": { "var_type": "FIELD_FLOAT", "quill_stack_duration": "14.0" }, "05": { "var_type": "FIELD_FLOAT", "max_damage": "550.0" }, "06": { "var_type": "FIELD_INTEGER", "projectile_speed": "2400" } } };

@registerAbility()
export class ability2_bristleback_quill_spray extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "bristleback_quill_spray";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_bristleback_quill_spray = Data_bristleback_quill_spray;
    Init() {
        this.SetDefaultSpecialValue("damage", [500, 1000, 1500, 2000, 2500, 3000]);
        this.SetDefaultSpecialValue("bleed_damage", [100, 200, 300, 400, 500, 600]);
        this.SetDefaultSpecialValue("damage_str_factor", [0.5, 1, 2, 4, 7, 10]);
        this.SetDefaultSpecialValue("bleed_damage_str_factor", [0.5, 1, 2, 4, 7, 10]);
        this.SetDefaultSpecialValue("duration", 4);
        this.SetDefaultSpecialValue("max_layer", 5);
        this.SetDefaultSpecialValue("radius", 900);
    }


    GetAOERadius() {
        return this.GetSpecialValueFor("radius") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_bristleback_custom_2")
    }
    OnSpellStart() {
        this.OnCastAbility2()
    }
    OnCastAbility2(radius: number = null, vPosition: Vector = null) {
        let hCaster = this.GetCasterPlus()
        vPosition = vPosition || hCaster.GetAbsOrigin()
        radius = (radius || this.GetSpecialValueFor("radius")) + this.GetCasterPlus().GetTalentValue("special_bonus_unique_bristleback_custom_2")
        let duration = this.GetSpecialValueFor("duration")
        let damage = this.GetSpecialValueFor("damage")
        let bleed_damage = this.GetSpecialValueFor("bleed_damage")
        let damage_str_factor = this.GetSpecialValueFor("damage_str_factor")
        let bleed_damage_str_factor = this.GetSpecialValueFor("bleed_damage_str_factor")
        let inherit_pct = this.GetSpecialValueFor("inherit_pct")
        // 音效
        EmitSoundOnLocationWithCaster(vPosition, ResHelper.GetSoundReplacement("Hero_Bristleback.QuillSpray.Cast", hCaster), hCaster)
        // 特效
        let iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_bristleback/bristleback_quill_spray.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: null
        });

        if (vPosition) {
            ParticleManager.SetParticleControl(iParticleID, 0, vPosition)
        } else {
            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
        }
        ParticleManager.ReleaseParticleIndex(iParticleID)
        let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), vPosition, null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
        for (let hTarget of (tTarget)) {
            let hModifier = modifier_bristleback_2_buff.apply(hTarget, hCaster, this, { duration: duration })
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_bristleback/bristleback_quill_spray_impact.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hTarget
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
            let iStock = GFuncEntity.IsValid(hModifier) && hModifier.GetStackCount() || 0
            let fDamage = damage + hCaster.GetStrength() * damage_str_factor * iStock
            let damage_table =
            {
                ability: this,
                attacker: hCaster,
                victim: hTarget,
                damage: fDamage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
            }
            BattleHelper.GoApplyDamage(damage_table)
            let fBloodDamage = bleed_damage + hCaster.GetStrength() * bleed_damage_str_factor * iStock;
            modifier_bleeding.Bleeding(hTarget,
                hCaster, this, duration, (tDamageTable) => {
                    return fBloodDamage
                }, true)
        }
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_bristleback_2"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_bristleback_2 extends BaseModifier_Plus {
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
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (ability == null || ability.IsNull()) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let caster = ability.GetCasterPlus()

            if (!ability.GetAutoCastState()) {
                return
            }

            if (caster.IsTempestDouble() || caster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }

            let range = caster.Script_GetAttackRange()

            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets.length > 0) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && GFuncMath.PRD(this.GetCasterPlus().GetTalentValue("special_bonus_unique_bristleback_custom_6"), this.GetParentPlus(), "modifier_bristleback_2")) {
            (this.GetAbilityPlus() as ability2_bristleback_quill_spray).OnCastAbility2()
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_bristleback_2_buff extends BaseModifier_Plus {
    max_layer: number;
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
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        this.max_layer = this.GetSpecialValueFor("max_layer")
        if (IsServer()) {
            if (hCaster.HasTalent("special_bonus_unique_bristleback_custom_7")) {
                this.IncrementStackCount()
            } else {
                let hAbility6 = ability6_bristleback_warpath.findIn(hCaster);
                if (GFuncEntity.IsValid(hAbility6) && hAbility6.GetLevel() >= 1) {
                    let bonus_max_stacks = hAbility6.GetSpecialValueFor("bonus_max_stacks")
                    this.max_layer = this.max_layer + bonus_max_stacks
                }
                this.SetStackCount(math.min(this.GetStackCount() + 1, this.max_layer))
            }
        } else if (params.IsOnCreated) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_bristleback/bristleback_quill_spray_hit.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }


}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_bristleback_2_buff_2 extends BaseModifier_Plus {
    max_stacks: number;
    per_stacks_base_attack_pct: number;
    per_stacks_attack_speed: number;
    per_stacks_amplify_damage_pct: number;
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
        let hCaster = this.GetCasterPlus()
        this.max_stacks = this.GetSpecialValueFor("max_stacks") + hCaster.GetTalentValue("special_bonus_unique_bristleback_custom_8")
        this.per_stacks_base_attack_pct = this.GetSpecialValueFor("per_stacks_base_attack_pct")
        this.per_stacks_attack_speed = this.GetSpecialValueFor("per_stacks_attack_speed")
        this.per_stacks_amplify_damage_pct = this.GetSpecialValueFor("per_stacks_amplify_damage_pct")
        if (IsServer()) {
            this.SetStackCount(params.inherit_pct || 0)
        }
    }



    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    GetBaseDamageOutgoing_Percentage() {
        return this.per_stacks_base_attack_pct * this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)

    GetAttackSpeedBonus_Constant() {
        return this.per_stacks_attack_speed * this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_BONUS)
    CC_GetModifierSpellAmplifyBonus(params: IModifierTable) {
        return this.per_stacks_amplify_damage_pct * this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_tooltip() {
        return this.per_stacks_amplify_damage_pct * this.GetStackCount()
    }
}
