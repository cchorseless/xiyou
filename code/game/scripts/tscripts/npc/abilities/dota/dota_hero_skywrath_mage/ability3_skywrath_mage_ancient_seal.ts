
import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../modifier/modifier_event";
import { ability6_skywrath_mage_mystic_flare } from "./ability6_skywrath_mage_mystic_flare";


/** dota原技能数据 */
export const Data_skywrath_mage_ancient_seal = { "ID": "5583", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "Hero_SkywrathMage.AncientSeal.Target", "HasScepterUpgrade": "1", "AbilityCastRange": "700 750 800 850", "AbilityCastPoint": "0.1 0.1 0.1 0.1", "AbilityCooldown": "14", "AbilityManaCost": "80 90 100 110", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "resist_debuff": "-30 -35 -40 -45", "LinkedSpecialBonus": "special_bonus_unique_skywrath_3" }, "02": { "var_type": "FIELD_FLOAT", "seal_duration": "3.0 4.0 5.0 6.0" }, "03": { "var_type": "FIELD_INTEGER", "scepter_radius": "700", "RequiresScepter": "1" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_skywrath_mage_ancient_seal extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "skywrath_mage_ancient_seal";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_skywrath_mage_ancient_seal = Data_skywrath_mage_ancient_seal;
    Init() {
        this.SetDefaultSpecialValue("resist_debuff_percent", [10, 13, 16, 20, 25]);
        this.SetDefaultSpecialValue("duration", 6);
        this.SetDefaultSpecialValue("chance", 25);
        this.SetDefaultSpecialValue("int_factor", 100);
        this.SetDefaultSpecialValue("int_factor_magical_damage_pct", 2.5);

    }

    Init_old() {
        this.SetDefaultSpecialValue("resist_debuff_percent", [5, 15, 20, 25, 30]);
        this.SetDefaultSpecialValue("duration", 6);
        this.SetDefaultSpecialValue("chance", [3, 6, 9, 12, 15]);

    }


    GetIntrinsicModifierName() {
        return "modifier_skywrath_mage_3"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_skywrath_mage_3 extends BaseModifier_Plus {
    duration: number;
    chance: number;
    int_factor: number;
    int_factor_magical_damage_pct: number;
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
    Init(params: ModifierTable) {
        this.duration = this.GetSpecialValueFor("duration")
        this.chance = this.GetSpecialValueFor("chance")
        this.int_factor = this.GetSpecialValueFor("int_factor")
        this.int_factor_magical_damage_pct = this.GetSpecialValueFor("int_factor_magical_damage_pct")
    }


    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    takeDamage(params: ModifierTable) {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            let hAbility_3 = ability6_skywrath_mage_mystic_flare.findIn(hParent)
            if (GameFunc.IsValid(params.inflictor) && params.attacker == hParent && !params.attacker.IsIllusion() && GameFunc.IsValid(params.unit) && params.unit.IsAlive()) {
                if (GameFunc.mathUtil.PRD(this.chance, hParent, "skywrath_mage_4")) {
                    if (GameFunc.IsValid(hAbility_3) && params.inflictor == hAbility_3) {
                        if (modifier_skywrath_mage_3_sing.exist(params.unit)) {
                            return
                        } else {
                            modifier_skywrath_mage_3_sing.apply(params.unit, hParent, hAbility, { duration: 2.5 })
                        }
                    }
                    modifier_skywrath_mage_3_debuff.apply(params.unit, hParent, hAbility, { duration: this.duration })
                }
            }
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OUTGOING_MAGICAL_DAMAGE_PERCENTAGE)
    EOM_GetModifierOutgoingMagicalDamagePercentage() {
        if (GameFunc.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().HasShard()) {
            return math.floor(this.GetParentPlus().GetIntellect() / this.int_factor) * this.int_factor_magical_damage_pct
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_skywrath_mage_3_debuff extends BaseModifier_Plus {
    resist_debuff_percent: number;
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
    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.resist_debuff_percent = this.GetSpecialValueFor("resist_debuff_percent") + hCaster.GetTalentValue("special_bonus_unique_skywrath_mage_custom_6")
        if (IsServer()) {
            this.IncrementStackCount()
            this.addTimer(params.duration, () => {
                this.DecrementStackCount()
            })
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_MAGICAL_DAMAGE_PERCENTAGE)
    G_INCOMING_MAGICAL_DAMAGE_PERCENTAGE() {
        return this.resist_debuff_percent * this.GetStackCount()
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)

    tooltip() {
        return this.resist_debuff_percent * this.GetStackCount()
    }
    //   EOM_GetModifierIncomingMagicalDamagePercentage() {
    //  	return this.resist_debuff_percent * this.GetStackCount()
    //  }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_skywrath_mage_3_sing extends BaseModifier_Plus {
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

}
