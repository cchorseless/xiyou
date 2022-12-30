import { GameFunc } from "../../../../GameFunc";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_night_stalker_2, modifier_night_stalker_2_form } from "./ability2_night_stalker_crippling_fear";

/** dota原技能数据 */
export const Data_night_stalker_hunter_in_the_night = { "ID": "5277", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "HasShardUpgrade": "1", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "bonus_movement_speed_pct_night": "22 28 34 40", "LinkedSpecialBonus": "special_bonus_unique_night_stalker_5" }, "02": { "var_type": "FIELD_INTEGER", "bonus_attack_speed_night": "20 40 60 80", "LinkedSpecialBonus": "special_bonus_unique_night_stalker_2" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_5" };

@registerAbility()
export class ability3_night_stalker_hunter_in_the_night extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "night_stalker_hunter_in_the_night";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_night_stalker_hunter_in_the_night = Data_night_stalker_hunter_in_the_night;
    Init() {
        this.SetDefaultSpecialValue("chance_day", [5, 6, 7, 8, 9]);
        this.SetDefaultSpecialValue("chance_night", [17, 19, 21, 23, 25]);
        this.SetDefaultSpecialValue("duration_day", 2);
        this.SetDefaultSpecialValue("duration_night", 5);
        this.SetDefaultSpecialValue("damage_per_seconds", [1000, 2000, 3000, 4000, 5000]);
        this.SetDefaultSpecialValue("damage_interval", 0.5);
        this.SetDefaultSpecialValue("increase_all_damage_pct", 20);

    }

    Init_old() {
        this.SetDefaultSpecialValue("chance_day", [5, 6, 7, 8, 9]);
        this.SetDefaultSpecialValue("chance_night", [17, 19, 21, 23, 25]);
        this.SetDefaultSpecialValue("duration_day", 2);
        this.SetDefaultSpecialValue("duration_night", 5);
        this.SetDefaultSpecialValue("damage_per_seconds", [200, 500, 700, 1000, 1300]);
        this.SetDefaultSpecialValue("damage_interval", 0.5);

    }



    CripplingFear(hTarget: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hTarget)) {
            return
        }

        if (modifier_night_stalker_3_debuff.exist(hTarget)) {
            return
        }

        let hCaster = this.GetCasterPlus()
        let bIsNighttime = modifier_night_stalker_2_form.exist(hCaster)

        let chance_day = this.GetSpecialValueFor("chance_day")
        let chance_night = this.GetSpecialValueFor("chance_night")
        let chance = bIsNighttime && chance_night || chance_day
        let duration_day = this.GetSpecialValueFor("duration_day")
        let duration_night = this.GetSpecialValueFor("duration_night")
        let duration = bIsNighttime && duration_night || duration_day

        if (GameFunc.mathUtil.PRD(chance, hCaster, "night_stalker_4")) {
            modifier_night_stalker_3_debuff.apply(hTarget, hCaster, this, { duration: duration * hTarget.GetStatusResistanceFactor(hCaster) })
            // 魔晶每个伤残恐惧单位提供20%全伤害
            if (hCaster.HasShard()) {
                modifier_night_stalker_3_buff.apply(hCaster, hTarget, this, { duration: duration * hTarget.GetStatusResistanceFactor(hCaster) })
            }
        }
    }
    GetIntrinsicModifierName() {
        return "modifier_night_stalker_3"
    }
}
// Modifiers
@registerModifier()
export class modifier_night_stalker_3 extends BaseModifier_Plus {
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
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    GetTotalDamageOutgoing_Percentage(params: ModifierAttackEvent) {
        if (IsServer()) {
            if (this.GetParentPlus().PassivesDisabled()) {
                return
            }

            if (UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetParentPlus().GetTeamNumber()) != UnitFilterResult.UF_SUCCESS) {
                return
            }

            let hAbility = params.inflictor
            if (params.damage_category == DamageCategory_t.DOTA_DAMAGE_CATEGORY_ATTACK || (params.damage_category == DamageCategory_t.DOTA_DAMAGE_CATEGORY_SPELL && GameFunc.IsValid(hAbility) && !hAbility.IsItem())) {
                let ability = this.GetAbilityPlus() as ability3_night_stalker_hunter_in_the_night
                if (ability.CripplingFear != null) {
                    ability.CripplingFear(params.target as IBaseNpc_Plus)
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_night_stalker_3_debuff extends BaseModifier_Plus {
    damage_per_seconds: number;
    damage_interval: number;
    GetTexture() {
        return ResHelper.GetAbilityTextureReplacement("night_stalker_crippling_fear", this.GetCasterPlus())
    }
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
    ShouldUseOverheadOffset() {
        return true
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.damage_per_seconds = this.GetSpecialValueFor("damage_per_seconds") + hCaster.GetTalentValue("special_bonus_unique_night_stalker_custom_2")
        this.damage_interval = this.GetSpecialValueFor("damage_interval")
        let hModifier = modifier_night_stalker_2.findIn(hCaster)
        if (GameFunc.IsValid(hModifier) && hModifier.GetCripplingFearDPS != null) {
            this.damage_per_seconds = this.damage_per_seconds + hModifier.GetCripplingFearDPS()
        }
        if (IsServer()) {
            EmitSoundOnLocationWithCaster(hParent.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Nightstalker.Trickling_Fear"), hCaster)
            this.StartIntervalThink(this.damage_interval)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_night_stalker/nightstalker_crippling_fear.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, false, -1, false, true)
        }
    }
    OnRefresh(params: ModifierTable) {
        super.OnRefresh(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.damage_per_seconds = this.GetSpecialValueFor("damage_per_seconds") + hCaster.GetTalentValue("special_bonus_unique_night_stalker_custom_2")
        this.damage_interval = this.GetSpecialValueFor("damage_interval")
        let hModifier = modifier_night_stalker_2.findIn(hCaster)
        if (GameFunc.IsValid(hModifier) && hModifier.GetCripplingFearDPS != null) {
            this.damage_per_seconds = this.damage_per_seconds + hModifier.GetCripplingFearDPS()
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            if (!GameFunc.IsValid(hAbility) || !GameFunc.IsValid(hCaster)) {
                this.Destroy()
                return
            }

            let tDamageTable = {
                ability: hAbility,
                victim: hParent,
                attacker: hCaster,
                damage: this.damage_per_seconds * this.damage_interval,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            }
            BattleHelper.GoApplyDamage(tDamageTable)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_SILENCED]: true,
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_night_stalker_3_buff extends BaseModifier_Plus {
    increase_all_damage_pct: number;
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
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(0)
        }
    }
    Init(params: ModifierTable) {
        this.increase_all_damage_pct = this.GetSpecialValueFor("increase_all_damage_pct")
    }

    OnIntervalThink() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            if (!GameFunc.IsValid(hCaster) || !hCaster.IsAlive()) {
                this.Destroy()
            }
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OUTGOING_DAMAGE_PERCENTAGE)
    EOM_GetModifierOutgoingDamagePercentage() {
        return this.increase_all_damage_pct
    }
}
