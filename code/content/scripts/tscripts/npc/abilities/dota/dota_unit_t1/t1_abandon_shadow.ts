import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";


@registerAbility()
export class t1_abandon_shadow extends BaseAbility_Plus {

    OnAbilityPhaseStart() {
        let caster = this.GetCasterPlus()
        modifier_t1_abandon_shadow_particle.apply(caster, caster, this, { duration: this.GetCastPoint() })

        return true
    }
    OnAbilityPhaseInterrupted() {
        modifier_t1_abandon_shadow_particle.remove(this.GetCasterPlus());
        return true
    }
    OnSpellStart() {
        let caster = this.GetCasterPlus()
        modifier_t1_abandon_shadow_particle.remove(caster);
        // BuildSystem.ReplaceBuilding(caster, "t05")
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t1_abandon_shadow_particle extends modifier_particle {
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/towers/abandon_shadow.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetCasterPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
}