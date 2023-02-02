import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { ability2_leshrac_diabolic_edict } from "./ability2_leshrac_diabolic_edict";

/** dota原技能数据 */
export const Data_leshrac_pulse_nova = { "ID": "5244", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_TOGGLE | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "1", "AbilityDraftUltScepterAbility": "leshrac_greater_lightning_storm", "AbilityCastPoint": "0 0 0 0", "AbilityCooldown": "1.0 1.0 1.0 1.0", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityManaCost": "70", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "mana_cost_per_second": "20 40 60" }, "02": { "var_type": "FIELD_INTEGER", "radius": "525" }, "03": { "var_type": "FIELD_INTEGER", "damage": "100 150 200", "LinkedSpecialBonus": "special_bonus_unique_leshrac_6" } } };

@registerAbility()
export class ability6_leshrac_pulse_nova extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "leshrac_pulse_nova";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_leshrac_pulse_nova = Data_leshrac_pulse_nova;

    Init() {
        this.SetDefaultSpecialValue("radius", 800);
        this.SetDefaultSpecialValue("damage", [50, 200, 400, 500, 600]);
        this.SetDefaultSpecialValue("damage_per_mana", [0.2, 0.3, 0.4, 0.5, 0.6]);
        this.SetDefaultSpecialValue("duration", 3);
        this.SetDefaultSpecialValue("scepter_damage", 2000);
        this.SetDefaultSpecialValue("scepter_duration", 4);

    }

    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("radius")
    }
    // GetIntrinsicModifierName() {
    //     return "modifier_leshrac_6"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_leshrac_6 extends BaseModifier_Plus {
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
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            if (hParent.IsIllusion()) {
                this.Destroy()
            }
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    OnAbilityExecuted(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        let hCaster = params.unit
        if (hCaster != null && hCaster == hParent && !hCaster.IsIllusion() && hCaster.IsAlive()) {
            let hAbility = params.ability
            if (hAbility == null || hAbility.IsItem() || hAbility.IsToggle()) {
                return
            }
            let duration = this.GetSpecialValueFor("duration") + (hParent.HasScepter() && this.GetSpecialValueFor("scepter_duration") || 0)
            modifier_leshrac_6_buff.apply(hCaster, hCaster, this.GetAbilityPlus(), { duration: duration })
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_leshrac_6_buff// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_leshrac_6_buff extends BaseModifier_Plus {
    radius: number;
    damage_per_mana: number;
    tTimeInfo: {};
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
        return true
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: IModifierTable) {
        this.radius = this.GetSpecialValueFor("radius")
        this.damage_per_mana = this.GetSpecialValueFor("damage_per_mana")
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            this.IncrementStackCount()
            GTimerHelper.AddTimer(params.duration, GHandler.create(this, () => {
                this.DecrementStackCount()
            }))
        }
        else if (params.IsOnCreated) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_leshrac/leshrac_pulse_nova_ambient.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }

    AOEDamage() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()

        let base_damage = hCaster.HasScepter() && this.GetSpecialValueFor("scepter_damage") || this.GetSpecialValueFor("damage")
        let damage = base_damage + hCaster.GetMaxMana() * (this.damage_per_mana + hCaster.GetTalentValue("special_bonus_unique_leshrac_custom_5"))
        let chance = hCaster.GetTalentValue("special_bonus_unique_leshrac_custom_8")
        let leshrac_2 = ability2_leshrac_diabolic_edict.findIn(hCaster)
        let is_valid_leshrac_2 = GameFunc.IsValid(leshrac_2) && leshrac_2.GetLevel() > 0

        let tTargets = AoiHelper.FindEntityInRadius(hParent.GetTeamNumber(), hParent.GetAbsOrigin(), this.radius, null, hAbility.GetAbilityTargetTeam(), hAbility.GetAbilityTargetType(), hAbility.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER)
        for (let hTarget of (tTargets)) {
            //  特效
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_leshrac/leshrac_pulse_nova.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hTarget.GetAbsOrigin())
            ParticleManager.ReleaseParticleIndex(iParticleID)
            EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Leshrac.Pulse_Nova_Strike", hCaster), hCaster)
            //  伤害
            BattleHelper.GoApplyDamage({
                ability: hAbility,
                victim: hTarget,
                attacker: hCaster,
                damage: damage,
                damage_type: hAbility.GetAbilityDamageType(),
            })
            //  天赋概率触发2技能
            if (chance > 0 && is_valid_leshrac_2 && GameFunc.mathUtil.PRD(chance, hParent, "leshrac_4_talent")) {
                // leshrac_2.OnSpellStart(hTarget)
            }
        }
    }



}
