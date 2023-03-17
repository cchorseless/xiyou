
import { AI_ability } from "../../../../ai/AI_ability";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_generic_shock } from "../../../modifier/effect/modifier_generic_shock";
import { modifier_particle, modifier_particle_thinker } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_zuus_thundergods_wrath = { "ID": "5113", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "2", "AbilitySound": "Hero_Zuus.GodsWrath", "HasScepterUpgrade": "1", "AbilityDraftUltScepterAbility": "zuus_cloud", "AbilityCastPoint": "0.4 0.4 0.4 0.4", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_5", "AbilityCooldown": "130 125 120", "AbilityManaCost": "300 400 500", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "sight_radius_day": "500" }, "02": { "var_type": "FIELD_INTEGER", "sight_radius_night": "500" }, "03": { "var_type": "FIELD_FLOAT", "sight_duration": "3.0 3.0 3.0 3.0" }, "04": { "var_type": "FIELD_INTEGER", "damage": "300 400 500", "LinkedSpecialBonus": "special_bonus_unique_zeus_4" } } };

@registerAbility()
export class ability6_zuus_thundergods_wrath extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "zuus_thundergods_wrath";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_zuus_thundergods_wrath = Data_zuus_thundergods_wrath;
    Init() {
        this.SetDefaultSpecialValue("radius", 1500);
        this.SetDefaultSpecialValue("damage", [400, 800, 1600, 3200, 6400, 9600]);
        this.SetDefaultSpecialValue("shock_bonus_int", [3, 5, 7, 9, 11, 14]);

    }


    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("radius")
    }
    hPtclThinker: IBaseNpc_Plus;
    OnAbilityPhaseStart() {
        let hCaster = this.GetCasterPlus()
        this.hPtclThinker = modifier_zuus_6_particle_pre.applyThinker(hCaster.GetAbsOrigin(), hCaster, this)
        this.GetCasterPlus().EmitSound(ResHelper.GetSoundReplacement("Hero_Zuus.GodsWrath.PreCast", this.GetCasterPlus()))
        return true
    }
    OnAbilityPhaseInterrupted() {
        if (GFuncEntity.IsValid(this.hPtclThinker)) {
            this.hPtclThinker.SafeDestroy();
            this.hPtclThinker = null
        }
        this.GetCasterPlus().StopSound(ResHelper.GetSoundReplacement("Hero_Zuus.GodsWrath.PreCast", this.GetCasterPlus()))
    }
    OnSpellStart() {
        if (GFuncEntity.IsValid(this.hPtclThinker)) {
            this.hPtclThinker.SafeDestroy();
            this.hPtclThinker = null
        }
        let sTalentName = "special_bonus_unique_zuus_custom_5"
        let hCaster = this.GetCasterPlus()
        let damage = hCaster.HasTalent(sTalentName) && this.GetSpecialValueFor("damage", 200) + hCaster.GetTalentValue(sTalentName) * hCaster.GetIntellect() || this.GetSpecialValueFor("damage", 200)
        let radius = this.GetSpecialValueFor("radius", 1000)
        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0)
        for (let hTarget of (tTargets)) {
            let buff = modifier_zuus_6_particle_damage.apply(hTarget, hCaster, this, {
                duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION
            });
            if (buff) {
                buff.tDamageTable = {
                    ability: this,
                    attacker: hCaster,
                    victim: hTarget,
                    damage: damage,
                    damage_type: this.GetAbilityDamageType()
                }
            }
            modifier_generic_shock.Shock(hTarget, hCaster, this, this.GetSpecialValueFor("shock_bonus_int") * hCaster.GetIntellect())
        }

        EmitSoundOnLocationWithCaster(hCaster.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Zuus.GodsWrath.Target", hCaster), hCaster)
        // hCaster.EmitSound("Hero_Zuus.GodsWrath")
        //  let hModifier  = modifier_zuus_2.findIn(  hCaster )
        //  if ( hModifier ) {
        //  	hModifier.SetStackCount(0)
        //  }
        //  let zuus_2  = zuus_2.findIn(  hCaster )
        //  if ( zuus_2 ) {
        //  	hCaster.SwapAbilities("zuus_2", "zuus_3", true, false)
        //  	hCaster.RemoveAbility("zuus_3")
        //  	zuus_2.SetActivated(true)
        //  }
    }

    AutoSpellSelf() {
        let range = this.GetSpecialValueFor("radius");
        AI_ability.NO_TARGET_if_enemy(this, range)
    }

}


// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -

@registerModifier()
export class modifier_zuus_6_particle_damage extends modifier_particle {
    tDamageTable: BattleHelper.DamageOptions;
    BeCreated(params: IModifierTable) {

        let hParent = this.GetParentPlus()
        let hCaster = this.GetCasterPlus()
        if (!IsServer()) {
            let resinfo: ResHelper.ParticleInfo = {
                resPath: "particles/units/heroes/hero_zuus/zuus_thundergods_wrath.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                level: ResHelper.PARTICLE_DETAIL_LEVEL.PARTICLE_DETAIL_LEVEL_ULTRA
            }
            let iParticleID = ResHelper.CreateParticle(resinfo)
            ParticleManager.SetParticleControl(iParticleID, 0, (hParent.GetAbsOrigin() + Vector(0, 0, 4000)) as Vector)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleShouldCheckFoW(iParticleID, false)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
    BeDestroy() {

        if (this.tDamageTable) {
            BattleHelper.GoApplyDamage(this.tDamageTable)
        }
    }
}

@registerModifier()
export class modifier_zuus_6_particle_pre extends modifier_particle_thinker {
    BeCreated(params: IModifierTable) {

        if (!IsServer()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_zuus/zuus_thundergods_wrath_start.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: this.GetCasterPlus()
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", this.GetCasterPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetCasterPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 2, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", this.GetCasterPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
}