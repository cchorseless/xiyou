
import { AI_ability } from "../../../../ai/AI_ability";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_shock } from "../../../modifier/effect/modifier_shock";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { ability1_zuus_arc_lightning } from "./ability1_zuus_arc_lightning";
import { ability2_zuus_lightning_bolt } from "./ability2_zuus_lightning_bolt";
import { ability6_zuus_thundergods_wrath } from "./ability6_zuus_thundergods_wrath";

/** dota原技能数据 */
export const Data_zuus_static_field = { "ID": "5112", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "AbilitySound": "Hero_Zuus.StaticField", "HasShardUpgrade": "1", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "damage_health_pct": "4 6 8 10", "LinkedSpecialBonus": "special_bonus_unique_zeus", "CalculateSpellDamageTooltip": "0" }, "02": { "var_type": "FIELD_INTEGER", "hop_distance": "450" }, "03": { "var_type": "FIELD_FLOAT", "hop_duration": "0.5" }, "04": { "var_type": "FIELD_INTEGER", "hop_height": "250" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3", "AbilityCastGestureSlot": "DEFAULT" };

@registerAbility()
export class ability3_zuus_static_field extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "zuus_static_field";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_zuus_static_field = Data_zuus_static_field;
    Init() {
        this.SetDefaultSpecialValue("damage_health_pct", [2, 4, 6, 8, 10]);
        this.SetDefaultSpecialValue("roshan_damage_health_pct", 100);
        this.SetDefaultSpecialValue("max_mana_damage_factor", 8);
        this.SetDefaultSpecialValue("scepter_duration", 10);
        this.SetDefaultSpecialValue("scepter_radius", 1200);
        this.SetDefaultSpecialValue("shock_bonus_increase", [6, 7, 8, 9, 10]);
        this.SetDefaultSpecialValue("shock_bonus_limit", 10);

    }

    GetBehaviorInt() {
        let iBehavior = tonumber(tostring(super.GetBehavior()))
        // A杖效果
        if (this.GetCasterPlus().HasScepter()) {
            iBehavior = iBehavior - DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST
        }
        return iBehavior
    }
    TriggerStaticField(hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let damage_health_pct = this.GetSpecialValueFor("damage_health_pct")
        damage_health_pct = !hTarget.IsAncient() && damage_health_pct || this.GetSpecialValueFor("roshan_damage_health_pct")
        let sTalentName = "special_bonus_unique_zuus_custom_4"
        let max_mana_damage_factor = hCaster.HasTalent(sTalentName) && this.GetSpecialValueFor("max_mana_damage_factor") + hCaster.GetTalentValue(sTalentName) || this.GetSpecialValueFor("max_mana_damage_factor")
        modifier_zuus_3_particle_damage.apply(hCaster, hTarget, this, { duration: modifier_zuus_3_particle_damage.LOCAL_PARTICLE_MODIFIER_DURATION })
        let fDamage = math.min(hTarget.GetHealth() * damage_health_pct * 0.01, hCaster.GetMaxMana() * max_mana_damage_factor)
        let tDamageTable = {
            ability: this,
            attacker: hCaster,
            victim: hTarget,
            damage: fDamage,
            damage_type: this.GetAbilityDamageType(),
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
            eom_flags: BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_NO_DAMAGE_AMPLIFY
        }
        let zuus_2 = ability2_zuus_lightning_bolt.findIn(hCaster)
        if (modifier_zuus_3_scepter.exist(hCaster)
            && GameFunc.IsValid(zuus_2)
            && zuus_2.FireZuus2
            && zuus_2.GetLevel() > 0) {
            let hUnits = AoiHelper.FindEntityInRadius(
                hCaster.GetTeamNumber(),
                hTarget.GetAbsOrigin(),
                this.GetSpecialValueFor("scepter_radius"),
                null,
                this.GetAbilityTargetTeam(),
                this.GetAbilityTargetType(),
                this.GetAbilityTargetFlags(),
                FindOrder.FIND_ANY_ORDER,
            );
            let hMaxHealthUnit = null
            let fMaxHealth = 0
            for (let hUnit of (hUnits as IBaseNpc_Plus[])) {
                if (GameFunc.IsValid(hUnit)) {
                    let fHelath = hUnit.GetHealth()
                    if (fHelath > fMaxHealth) {
                        fMaxHealth = fHelath
                        hMaxHealthUnit = hUnit
                    }
                }
            }
            if (GameFunc.IsValid(hMaxHealthUnit)) {
                zuus_2.FireZuus2(hMaxHealthUnit, this)
            }
        }
        BattleHelper.GoApplyDamage(tDamageTable)
        let buff = modifier_shock.findIn(hTarget)
        if (buff) {
            let stack = math.min(buff.GetStackCount() * (this.GetSpecialValueFor("shock_bonus_increase") * 0.01), hCaster.GetMaxMana() * this.GetSpecialValueFor("shock_bonus_limit"))
            modifier_shock.Shock(hTarget, hCaster, this, stack)
        }
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        modifier_zuus_3_scepter.apply(hCaster, hCaster, this, { duration: this.GetSpecialValueFor("scepter_duration") })
    }

    GetIntrinsicModifierName() {
        return modifier_zuus_3.name
    }

    AutoSpellSelf() {
        let hCaster = this.GetCasterPlus()
        let range = hCaster.GetBaseAttackRange()
        AI_ability.NO_TARGET_if_enemy(this, range)
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_zuus_3 extends BaseModifier_Plus {
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
    DestroyOnExpire() {
        return false
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    GetTotalDamageOutgoing_Percentage(params: ModifierAttackEvent) {
        if (IsServer()) {
            if (this.GetParentPlus().PassivesDisabled()) {
                return
            }
            if (BattleHelper.DamageFilter(params.record, BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_AFTER_TRANSFORMED_DAMAGE)) {
                return
            }
            let hAbility = params.inflictor
            if (GameFunc.IsValid(hAbility) &&
                (hAbility.GetAbilityName() == ability1_zuus_arc_lightning.name ||
                    hAbility.GetAbilityName() == ability2_zuus_lightning_bolt.name ||
                    hAbility.GetAbilityName() == ability6_zuus_thundergods_wrath.name) &&
                hAbility != this.GetAbilityPlus() && !hAbility.IsItem()) {
                (this.GetAbilityPlus() as ability3_zuus_static_field).TriggerStaticField(params.target as IBaseNpc_Plus)
            }
        }
    }
}
@registerModifier()
export class modifier_zuus_3_particle_damage extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params)
        let hCaster = this.GetParentPlus()
        let hParent = this.GetCasterPlus()
        if (IsServer()) {
            EmitSoundOnLocationWithCaster(hParent.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Zuus.StaticField", hCaster), hCaster)
        }
        else {
            let resinfo: ResHelper.ParticleInfo = {
                resPath: "particles/units/heroes/hero_zuus/zuus_static_field.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                level: ResHelper.PARTICLE_DETAIL_LEVEL.PARTICLE_DETAIL_LEVEL_LOW
            }
            let iParticleID = ResHelper.CreateParticle(resinfo)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_zuus_3_scepter// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_zuus_3_scepter extends BaseModifier_Plus {
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params)
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }

    OnIntervalThink() {
        if (!IsServer()) {
            return
        }
        let hAbility = this.GetAbilityPlus()
        if (!GameFunc.IsValid(hAbility)) {
            this.StartIntervalThink(-1)
            this.Destroy()
            return
        }
        let hCaster = hAbility.GetCasterPlus()
        if (hCaster.IsTempestDouble() || hCaster.IsIllusion()) {
            this.StartIntervalThink(-1)
            return
        }
    }

    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
        }
    }
}
