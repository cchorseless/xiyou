import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_necrolyte_heartstopper_aura = { "ID": "5159", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE | DOTA_ABILITY_BEHAVIOR_AURA", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "HasScepterUpgrade": "1", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "aura_radius": "800" }, "02": { "var_type": "FIELD_FLOAT", "aura_damage": "0.6 1.2 1.8 2.4", "LinkedSpecialBonus": "special_bonus_unique_necrophos_2" }, "03": { "var_type": "FIELD_FLOAT", "health_regen": "4 5 6 7" }, "04": { "var_type": "FIELD_FLOAT", "mana_regen": "4 5 6 7" }, "05": { "var_type": "FIELD_INTEGER", "hero_multiplier": "6" }, "06": { "var_type": "FIELD_FLOAT", "regen_duration": "8" }, "07": { "var_type": "FIELD_FLOAT", "scepter_multiplier": "2", "RequiresScepter": "1" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_necrolyte_heartstopper_aura extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "necrolyte_heartstopper_aura";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_necrolyte_heartstopper_aura = Data_necrolyte_heartstopper_aura;
    Init() {
        this.SetDefaultSpecialValue("base_damage", [100, 200, 400, 800, 1600]);
        this.SetDefaultSpecialValue("intellect_damage_factor", [1, 1, 2, 3, 4]);
        this.SetDefaultSpecialValue("intellect_bonus_factor", [1, 1, 1, 1, 2]);
        this.SetDefaultSpecialValue("scepter_intellect_bonus_factor", 1);
        this.SetDefaultSpecialValue("aura_radius", 1000);
        this.SetDefaultSpecialValue("damage_think_interval", 0.5);

    }

    Init_old() {
        this.SetDefaultSpecialValue("base_damage", [40, 115, 190, 265, 340]);
        this.SetDefaultSpecialValue("intellect_damage_factor", [0.2, 0.3, 0.4, 0.5, 0.6]);
        this.SetDefaultSpecialValue("intellect_bonus_factor", [0.2, 0.25, 0.3, 0.35, 0.4]);
        this.SetDefaultSpecialValue("scepter_intellect_bonus_factor", 0.2);
        this.SetDefaultSpecialValue("aura_radius", 1000);
        this.SetDefaultSpecialValue("damage_think_interval", 0.5);

    }


    GetIntrinsicModifierName() {
        return "modifier_necrolyte_3"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_necrolyte_3 extends BaseModifier_Plus {
    base_damage: number;
    intellect_damage_factor: number;
    intellect_bonus_factor: number;
    scepter_intellect_bonus_factor: number;
    aura_radius: number;
    damage_think_interval: number;
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
        this.base_damage = this.GetSpecialValueFor("base_damage")
        this.intellect_damage_factor = this.GetSpecialValueFor("intellect_damage_factor")
        this.intellect_bonus_factor = this.GetSpecialValueFor("intellect_bonus_factor")
        this.scepter_intellect_bonus_factor = this.GetSpecialValueFor("scepter_intellect_bonus_factor")
        this.aura_radius = this.GetSpecialValueFor("aura_radius")
        this.damage_think_interval = this.GetSpecialValueFor("damage_think_interval")
        if (IsServer()) {
            this.StartIntervalThink(this.damage_think_interval)
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            if (!GameFunc.IsValid(hCaster) || !GameFunc.IsValid(hAbility)) {
                this.Destroy()
                return
            }

            if (hParent.PassivesDisabled()) {
                return
            }

            let iInt = hCaster.GetIntellect != null && hCaster.GetIntellect() || 0
            let base_damage = this.base_damage + hCaster.GetTalentValue("special_bonus_unique_necrolyte_custom_1")
            let fDamage = (base_damage + this.intellect_damage_factor * iInt) * this.damage_think_interval

            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), this.aura_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
            for (let hTarget of (tTargets)) {

                BattleHelper.GoApplyDamage({
                    victim: hTarget,
                    attacker: hCaster,
                    damage: fDamage,
                    damage_type: hAbility.GetAbilityDamageType(),
                    ability: hAbility
                })
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    OnDeath(params: IModifierTable) {
        let hAttacker = params.attacker
        if (GameFunc.IsValid(hAttacker) && hAttacker.GetUnitLabel() != "builder") {
            if (hAttacker.GetTeamNumber() == params.unit.GetTeamNumber()) {
                return
            }
            hAttacker = hAttacker.GetSource()
            // if (GameFunc.IsValid(hAttacker) && hAttacker == this.GetParentPlus() && !hAttacker.IsIllusion() && !hAttacker.PassivesDisabled() && !Spawner.IsEndless()) {
            //     let factor = params.unit.IsConsideredHero() && 5 || 1
            //     let fInt = this.intellect_bonus_factor + (hAttacker.HasScepter() && this.scepter_intellect_bonus_factor || 0) + this.GetParentPlus().GetTalentValue("special_bonus_unique_necrolyte_custom_3")
            //      modifier_necrolyte_3_buff.apply( hAttacker , hAttacker, this.GetAbilityPlus(), { int=fInt * factor })
            // }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_necrolyte_3_buff extends BaseModifier_Plus {
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
        if (IsServer()) {
            let fInt = params.int || 0
            this.changeStackCount(fInt)
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    tooltip() {
        return this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    G_STATS_INTELLECT_BONUS() {
        return this.GetStackCount()
    }

}
