import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_generic_bleeding } from "../../../modifier/effect/modifier_generic_bleeding";
import { modifier_particle } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_centaur_return = { "ID": "5516", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3", "AbilityCastGestureSlot": "DEFAULT", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "return_damage": "15 30 45 60", "LinkedSpecialBonus": "special_bonus_unique_centaur_3" }, "02": { "var_type": "FIELD_INTEGER", "return_damage_str": "20 26 32 38" }, "03": { "var_type": "FIELD_INTEGER", "aura_radius": "1200" } } };

@registerAbility()
export class ability3_centaur_return extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "centaur_return";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_centaur_return = Data_centaur_return;
    Init() {
        this.SetDefaultSpecialValue("bonus_health_percent", [1, 2, 3, 5, 7]);
        this.SetDefaultSpecialValue("bonus_damage", [1, 2, 3, 4, 5]);
        this.SetDefaultSpecialValue("damage_gain_duration", 10);
        this.SetDefaultSpecialValue("max_stacks", 13);
        this.SetDefaultSpecialValue("base_strength_percent", [2, 4, 6, 8, 10]);
        this.SetDefaultSpecialValue("health_regen_percent", 10);
        this.SetDefaultSpecialValue("blood_duration", 5);

    }




    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("damage_gain_duration")
        let hModifier = modifier_centaur_3.findIn(hCaster)
        if (GFuncEntity.IsValid(hModifier)) {
            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Centaur.Retaliate.Cast"))
            modifier_centaur_3_buff.apply(hCaster, hCaster, this, { duration: duration, modifier_count: hModifier.GetStackCount() })
            hModifier.SetStackCount(0)
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_centaur_3"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_centaur_3 extends BaseModifier_Plus {
    max_stacks: number;
    bonus_health_percent: number;
    bonus_damage: number;
    damage_gain_duration: number;
    blood_duration: number;
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
    Init(params: IModifierTable) {
        this.max_stacks = this.GetSpecialValueFor("max_stacks")
        this.bonus_health_percent = this.GetSpecialValueFor("bonus_health_percent")
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage")
        this.damage_gain_duration = this.GetSpecialValueFor("damage_gain_duration")
        this.blood_duration = this.GetSpecialValueFor("blood_duration")
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (!GFuncEntity.IsValid(ability)) {
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

            if (this.GetStackCount() < this.max_stacks) {
                return
            }

            let range = caster.Script_GetAttackRange()
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex()
                })
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_BONUS)
    CC_GetModifierSpellAmplifyBonus(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (params != null && params.attacker == hParent && GFuncEntity.IsValid(params.inflictor) && !params.inflictor.IsItem() && !BattleHelper.DamageFilter(params.record, BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_BLEEDING)) {
            let iMaxHealth = hParent.GetMaxHealth()
            let iCurHealth = hParent.GetHealth()
            let iConsumeHealth = iMaxHealth * this.bonus_health_percent * 0.01
            if (iCurHealth > iConsumeHealth) {
                hParent.ModifyHealth(iCurHealth - iConsumeHealth, hAbility, false, 0)
                // 流血
                modifier_generic_bleeding.Bleeding(params.target, hParent, hAbility, this.blood_duration, (tDamageTable) => {
                    return iConsumeHealth
                }, true)
                modifier_centaur_3_particle.apply(hParent, params.target, hAbility, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
                let fDamage = iConsumeHealth * this.bonus_damage
                let fOriginalDamage = params.damage
                let fPercent = fDamage / fOriginalDamage

                this.IncrementStackCount()
                return fPercent * 100
            }
        }
    }
    OnStackCountChanged(iStackCount: number): void {
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsServer()) {
            if (this.GetStackCount() > this.max_stacks) {
                this.SetStackCount(this.max_stacks)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_centaur_3_buff extends BaseModifier_Plus {
    base_strength_percent: number;
    health_regen_percent: number;
    _tooltip: number;
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
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.base_strength_percent = this.GetSpecialValueFor("base_strength_percent") + hCaster.GetTalentValue("special_bonus_unique_centaur_custom_4")
        this.health_regen_percent = this.GetSpecialValueFor("health_regen_percent")
        if (IsServer()) {
            let iStrengthPercent = params.modifier_count || 0
            this.SetStackCount(params.modifier_count)
        } else if (params.IsOnCreated) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_centaur/centaur_return_buff.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BASE_PERCENTAGE)
    CC_STATS_STRENGTH_BASE_PERCENTAGE() {
        return this.base_strength_percent * this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE)
    GetHealthRegenPercentage() {
        return this.health_regen_percent
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_tooltip(params: IModifierTable) {
        this._tooltip = (this._tooltip || 0) % 2 + 1
        if (this._tooltip == 1) {
            return this.base_strength_percent * this.GetStackCount()
        } else if (this._tooltip == 2) {
            return this.health_regen_percent
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_centaur_3_particle extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()

        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_centaur/centaur_return.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
