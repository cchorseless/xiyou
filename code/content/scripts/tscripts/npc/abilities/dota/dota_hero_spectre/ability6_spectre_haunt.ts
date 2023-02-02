import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { ability3_spectre_dispersion } from "./ability3_spectre_dispersion";

/** dota原技能数据 */
export const Data_spectre_haunt = { "ID": "5337", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "FightRecapLevel": "2", "AbilitySound": "Hero_Spectre.Haunt", "HasScepterUpgrade": "1", "AbilityDraftPreAbility": "spectre_reality", "AbilityDraftUltScepterAbility": "spectre_haunt_single", "AbilityCastPoint": "0.3 0.3 0.3", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "180 160 140", "AbilityManaCost": "150 200 250", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "5.0 6.0 7.0" }, "02": { "var_type": "FIELD_INTEGER", "illusion_damage_outgoing": "-60 -40 -20" }, "03": { "var_type": "FIELD_INTEGER", "tooltip_outgoing": "40 60 80", "LinkedSpecialBonus": "special_bonus_unique_spectre_4" }, "04": { "var_type": "FIELD_INTEGER", "illusion_damage_incoming": "100 100 100" }, "05": { "var_type": "FIELD_INTEGER", "tooltip_illusion_total_damage_incoming": "200 200 200" }, "06": { "var_type": "FIELD_FLOAT", "attack_delay": "0" } } };

@registerAbility()
export class ability6_spectre_haunt extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "spectre_haunt";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_spectre_haunt = Data_spectre_haunt;
    Init() {
        this.SetDefaultSpecialValue("illusion_count", [2, 3, 4, 5, 6, 7]);
        this.SetDefaultSpecialValue("illusion_damage_outgoing", [50, 60, 70, 80, 90, 100]);
        this.SetDefaultSpecialValue("illusion_health_percent", [50, 60, 70, 80, 90, 100]);
        this.SetDefaultSpecialValue("duration", 7);
        this.SetDefaultSpecialValue("attack_range", 150);
        this.SetDefaultSpecialValue("movespeed", 800);

    }

    Init_old() {
        this.SetDefaultSpecialValue("illusion_count", [2, 3, 4, 5, 6, 7]);
        this.SetDefaultSpecialValue("illusion_damage_outgoing", [50, 60, 70, 80, 90, 100]);
        this.SetDefaultSpecialValue("illusion_health_percent", [50, 60, 70, 80, 90, 100]);
        this.SetDefaultSpecialValue("duration", 7);
        this.SetDefaultSpecialValue("attack_range", 150);
        this.SetDefaultSpecialValue("movespeed", 800);

    }



    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration")
        let illusion_count = this.GetSpecialValueFor("illusion_count") + hCaster.GetTalentValue("special_bonus_unique_spectre_custom_3")
        let iPlayerID = hCaster.GetPlayerOwnerID()
        let fDelay = 0.1

        let hAbility4 = ability3_spectre_dispersion.findIn(hCaster) as ability3_spectre_dispersion;
        // let tTargets = ShuffledList(Spawner.GetMissing(iPlayerID))
        // let count = 0
        // for (let hTarget of (tTargets)) {
        //     count = count + 1
        //     hAbility4.CreateGhost(hTarget, (count - 1) * fDelay)
        //     if (count >= illusion_count) {
        //         break
        //     }
        // }
        // if (tTargets.length > 0) {
        //     for (let i = count + 1; i < illusion_count; i++) {
        //         let hTarget = tTargets[RandomInt(1, tTargets.length)]
        //         hAbility4.CreateGhost(hTarget, (i - 1) * fDelay)
        //     }
        // }
        // modifier_spectre_6_particle_illusion_created.apply(hCaster, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Spectre.HauntCast", hCaster))
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Spectre.Haunt", hCaster))
    }

    GetIntrinsicModifierName() {
        return "modifier_spectre_6"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_spectre_6 extends BaseModifier_Plus {
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
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (!GameFunc.IsValid(ability)) {
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

            let playerID = caster.GetPlayerOwnerID()
            // let tTargets = ShuffledList(Spawner.GetMissing(playerID))
            // if (tTargets.length > 0) {
            //     ExecuteOrderFromTable({
            //         UnitIndex: caster.entindex(),
            //         OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
            //         AbilityIndex: ability.entindex()
            //     })
            // }
        }
    }
}
