import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_particle, modifier_particle_thinker } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_keeper_of_the_light_chakra_magic = { "ID": "5473", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_FRIENDLY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "Hero_KeeperOfTheLight.ChakraMagic.Target", "AbilityCastRange": "900 900 900 900", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "20 18 16 14", "AbilityManaCost": "0", "AbilityModifierSupportValue": "3.0", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "mana_restore": "100 180 260 340", "LinkedSpecialBonus": "special_bonus_unique_keeper_of_the_light_2" }, "02": { "var_type": "FIELD_INTEGER", "cooldown_reduction": "3 4 5 6" }, "03": { "var_type": "FIELD_FLOAT", "mana_leak_pct": "4.5 5 5.5 6.0" }, "04": { "var_type": "FIELD_FLOAT", "duration": "5" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_keeper_of_the_light_chakra_magic extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "keeper_of_the_light_chakra_magic";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_keeper_of_the_light_chakra_magic = Data_keeper_of_the_light_chakra_magic;
    Init() {
        this.SetDefaultSpecialValue("bonus_mana", [1, 2, 3, 4, 5]);
        this.SetDefaultSpecialValue("promote_mana_limit_percent", [10, 15, 20, 25, 35]);
        this.SetDefaultSpecialValue("duration", 5);
        this.SetDefaultSpecialValue("radius", 900);
        this.SetDefaultSpecialValue("increase_all_damage_pct", [20, 25, 30, 40, 50]);

    }

    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let radius = this.GetSpecialValueFor("radius")
        let duration = this.GetSpecialValueFor("duration")
        let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
        for (let unit of (tTarget)) {
            if (GameFunc.IsValid(unit) && unit.IsAlive()) {
                modifier_keeper_of_the_light_3_buff.apply(unit, hCaster, this, { duration: duration })
            }
        }
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_keeper_of_the_light_3"
    // }

}
// Modifiers
@registerModifier()
export class modifier_keeper_of_the_light_3 extends BaseModifier_Plus {
    bonus_mana: number;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }
    Init(params: ModifierTable) {
        this.bonus_mana = this.GetSpecialValueFor("bonus_mana")
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

            let range = ability.GetSpecialValueFor("radius")
            let teamFilter = ability.GetAbilityTargetTeam()
            let typeFilter = ability.GetAbilityTargetType()
            let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)

    death(params: ModifierTable) {
        let hAttacker = params.attacker
        let hTarget = params.unit
        if (!GameFunc.IsValid(hAttacker)) {
            return
        }
        if (hAttacker.GetTeamNumber() == params.unit.GetTeamNumber()) {
            return
        }
        if (hAttacker != null && hAttacker.GetUnitLabel() != "builder") {
            hAttacker = hAttacker.GetSource()
            let radius = this.GetSpecialValueFor("radius")
            if (hTarget.IsPositionInRange(this.GetParentPlus().GetAbsOrigin(), radius) && !hAttacker.IsIllusion()) {
                //  modifier_bonus_mana.apply( this.GetParentPlus() , this.GetParentPlus(), this.GetParentPlus().GetDummyAbility(), { bonus_mana: this.bonus_mana })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_keeper_of_the_light_3_buff extends BaseModifier_Plus {
    promote_mana_limit_percent: number;
    increase_all_damage_pct: number;
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
    GetTexture() {
        return "keeper_of_the_light_chakra_magic"
    }

    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.promote_mana_limit_percent = this.GetSpecialValueFor("promote_mana_limit_percent")
        this.increase_all_damage_pct = this.GetSpecialValueFor("increase_all_damage_pct")
        if (IsServer()) {
            EmitSoundOnLocationWithCaster(hParent.GetAbsOrigin(), "Hero_KeeperOfTheLight.ChakraMagic.Target", hCaster)
        }
        else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_keeper_of_the_light/keeper_of_the_light_chakra_magic.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_attack1", hParent.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MANA_PERCENTAGE)
    G_MANA_PERCENTAGE() {
        return this.promote_mana_limit_percent
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    tooltip() {
        return this.promote_mana_limit_percent
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OUTGOING_DAMAGE_PERCENTAGE)
    EOM_GetModifierOutgoingDamagePercentage(params: ModifierTable) {
        if (params != null && GameFunc.IsValid(params.target) && params.target.GetMana() <= 0) {
            return this.increase_all_damage_pct
        }
    }
}
