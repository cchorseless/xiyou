
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_alchemist_acid_spray = {"ID":"5365","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE","AbilityUnitDamageType":"DAMAGE_TYPE_PHYSICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","AbilityCastPoint":"0.2","AbilityCastRange":"900","AbilityCooldown":"22.0","AbilityManaCost":"130 140 150 160","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"475 525 575 625"},"02":{"var_type":"FIELD_FLOAT","duration":"16"},"03":{"var_type":"FIELD_INTEGER","damage":"20 25 30 35"},"04":{"var_type":"FIELD_INTEGER","armor_reduction":"4 5 6 7","LinkedSpecialBonus":"special_bonus_unique_alchemist_5"},"05":{"var_type":"FIELD_FLOAT","tick_rate":"1.0"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_alchemist_acid_spray extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "alchemist_acid_spray";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_alchemist_acid_spray = Data_alchemist_acid_spray;
    

    GetAbilityTextureName() {
        return ResHelper.GetAbilityTextureReplacement(super.GetAbilityTextureName(this), this.GetCasterPlus())
    }
     GetCastRange(vLocation:Vector, hTarget:BaseNpc_Plus) {
        return this.GetSpecialValueFor("radius")
    }
     OnToggle() {
        let hCaster = this.GetCasterPlus()
        if ( this.GetToggleState() ) {
            //  hCaster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_1)
            let iParticleID = ParticleManager.CreateParticle("particles/units/heroes/hero_alchemist/alchemist_acid_spray_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, hCaster)
            //  ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_attack3", hCaster.GetAbsOrigin(), false)
            ParticleManager.SetParticleControl(iParticleID, 0, hCaster.GetAttachmentOrigin(hCaster.ScriptLookupAttachment("attach_attack3")))
            ParticleManager.SetParticleControl(iParticleID, 1, hCaster.GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(255, 255, 255))
            ParticleManager.ReleaseParticleIndex(iParticleID)
    
            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Alchemist.AcidSpray", hCaster))
    
            hCaster.AddNewModifier(hCaster, this, "modifier_alchemist_1", null)
        } else {
            hCaster.StopSound(ResHelper.GetSoundReplacement("Hero_Alchemist.AcidSpray", hCaster))
            hCaster.RemoveModifierByName("modifier_alchemist_1")
        }
    }
     ProcsMagicStick() {
        return false
    }
}
    