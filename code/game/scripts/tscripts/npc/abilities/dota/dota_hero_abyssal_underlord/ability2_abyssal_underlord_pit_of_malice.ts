
import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_abyssal_underlord_pit_of_malice = { "ID": "5614", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "Hero_AbyssalUnderlord.PitOfMalice", "AbilityCastRange": "675", "AbilityCastPoint": "0.45", "FightRecapLevel": "1", "AbilityCooldown": "21 19 17 15", "AbilityManaCost": "80 100 120 140", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "400", "LinkedSpecialBonus": "special_bonus_unique_underlord_6" }, "02": { "var_type": "FIELD_FLOAT", "pit_duration": "12.0" }, "03": { "var_type": "FIELD_FLOAT", "pit_interval": "3.6" }, "04": { "var_type": "FIELD_INTEGER", "pit_damage": "0" }, "05": { "var_type": "FIELD_FLOAT", "ensnare_duration": "1.2 1.4 1.6 1.8", "LinkedSpecialBonus": "special_bonus_unique_underlord" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_abyssal_underlord_pit_of_malice extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "abyssal_underlord_pit_of_malice";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_abyssal_underlord_pit_of_malice = Data_abyssal_underlord_pit_of_malice;
    Init() {
        this.SetDefaultSpecialValue("radius", 500);
        this.SetDefaultSpecialValue("pit_duration", [8.0, 9.0, 10.0, 11.0, 12.0, 13.0]);
        this.SetDefaultSpecialValue("pit_interval", 3.6);
        this.SetDefaultSpecialValue("pit_damage", [50, 400, 750, 1100, 1450, 1800]);
        this.SetDefaultSpecialValue("ensnare_duration", 2);

    }



    iPreParticleID: ParticleID;


    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue("special_bonus_unique_abyssal_underlord_custom_6")
    }

    OnAbilityPhaseStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let radius = this.GetSpecialValueFor("radius")

        this.iPreParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/heroes_underlord/underlord_pitofmalice_pre.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN,
            owner: hCaster
        });

        ParticleManager.SetParticleControl(this.iPreParticleID, 0, vPosition)
        ParticleManager.SetParticleControl(this.iPreParticleID, 1, Vector(radius, 1, 1))

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_AbyssalUnderlord.PitOfMalice.Start", hCaster))
        return true
    }
    OnAbilityPhaseInterrupted() {
        if (this.iPreParticleID != null) {
            ParticleManager.DestroyParticle(this.iPreParticleID, true)
            this.iPreParticleID = null
        }
        let hCaster = this.GetCasterPlus()
        hCaster.StopSound(ResHelper.GetSoundReplacement("Hero_AbyssalUnderlord.PitOfMalice.Start", hCaster))
    }
    OnSpellStart() {
        if (this.iPreParticleID != null) {
            ParticleManager.DestroyParticle(this.iPreParticleID, true)
            this.iPreParticleID = null
        }
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()

        let pit_duration = this.GetSpecialValueFor("pit_duration")
        // .app
        modifier_abyssal_underlord_2_thinker.applyThinker(vPosition, hCaster, this, { duration: pit_duration }, hCaster.GetTeamNumber(), false)
    }

    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }

    GetIntrinsicModifierName() {
        return "modifier_abyssal_underlord_2"
    }




}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_abyssal_underlord_2 extends BaseModifier_Plus {
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
    GetTexture() {
        return "abyssal_underlord_pit_of_malice"
    }
    OnCreated(params: ModifierTable) {
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

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()
            let radius = ability.GetAOERadius()

            let position = AoiHelper.GetAOEMostTargetsPosition(caster.GetAbsOrigin(), range, caster.GetTeamNumber(), radius, null, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)

            //  施法命令
            if (position && position != vec3_invalid && caster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable(
                    {
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        AbilityIndex: ability.entindex(),
                        Position: position
                    }
                )
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_abyssal_underlord_2_thinker extends BaseModifier_Plus {
    radius: number;
    pit_interval: number;
    pit_duration: number;
    sSoundName: string;
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
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.radius = this.GetSpecialValueFor("radius")
        this.pit_interval = this.GetSpecialValueFor("pit_interval")
        this.pit_duration = this.GetSpecialValueFor("pit_duration")
        if (IsServer()) {
            this.StartIntervalThink(0)
            this.sSoundName = ResHelper.GetSoundReplacement("Hero_AbyssalUnderlord.PitOfMalice", hCaster)
            hParent.EmitSound(this.sSoundName)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/heroes_underlord/underlord_pitofmalice.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.radius, this.radius / 40, 1))
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(this.pit_duration, 0, 0))
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    OnRemoved() {
        if (IsServer()) {
            this.GetParentPlus().StopSound(this.sSoundName)
            UTIL_Remove(this.GetParentPlus())
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            if (!GameFunc.IsValid(hAbility)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }
            let sTalentName = "special_bonus_unique_abyssal_underlord_custom_8"
            let extra_pit_interval = hCaster.GetTalentValue(sTalentName)
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), this.radius, null, hAbility.GetAbilityTargetTeam(), hAbility.GetAbilityTargetType(), hAbility.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST)
            for (let hTarget of (tTargets)) {
                if (!modifier_abyssal_underlord_2_interval.exist(hTarget)) {
                    modifier_abyssal_underlord_2_interval.apply(hTarget, hCaster, hAbility, { duration: this.pit_interval - extra_pit_interval })
                }
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_abyssal_underlord_2_interval extends BaseModifier_Plus {
    ensnare_duration: number;
    IsHidden() {
        return true
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
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT + DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        this.ensnare_duration = this.GetSpecialValueFor("ensnare_duration")
        if (IsServer()) {
            modifier_abyssal_underlord_2_root.apply(this.GetParentPlus(), this.GetCasterPlus(), this.GetAbilityPlus(), { duration: this.ensnare_duration * this.GetParentPlus().GetStatusResistanceFactor(this.GetCasterPlus()) })
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_abyssal_underlord_2_root extends BaseModifier_Plus {
    pit_damage: number;
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
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        this.pit_damage = this.GetSpecialValueFor("pit_damage")
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            BattleHelper.GoApplyDamage({
                ability: hAbility,
                victim: hParent,
                attacker: hCaster,
                damage: this.pit_damage,
                damage_type: hAbility.GetAbilityDamageType()
            })
            if (hParent.IsConsideredHero()) {
                EmitSoundOnLocationForAllies(hParent.GetAbsOrigin(), "Hero_AbyssalUnderlord.Pit.TargetHero", hCaster)
            } else {
                EmitSoundOnLocationForAllies(hParent.GetAbsOrigin(), "Hero_AbyssalUnderlord.Pit.Target", hCaster)
            }
        } else {
            let iPtclID = ResHelper.CreateParticle({
                resPath: this.GetParentPlus().IsConsideredHero() && "particles/units/heroes/heroes_underlord/abyssal_underlord_pitofmalice_stun.vpcf" || "particles/units/heroes/heroes_underlord/abyssal_underlord_pitofmalice_stun_light.vpcf",
                resNpc: null,
                iAttachment: this.GetEffectAttachType(),
                owner: this.GetParentPlus()
            });

            this.AddParticle(iPtclID, false, false, -1, false, this.ShouldUseOverheadOffset())
        }
    }

    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_MAGICAL_DAMAGE_PERCENTAGE)
    G_INCOMING_MAGICAL_DAMAGE_PERCENTAGE() {
        return this.GetCasterPlus().GetTalentValue("special_bonus_unique_abyssal_underlord_custom_7")
    }
}
