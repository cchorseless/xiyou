import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";


@registerAbility()
export class t6_degenerate extends BaseAbility_Plus {

    OnAbilityPhaseStart() {
        let caster = this.GetCasterPlus()
        modifier_t6_degenerate_particle.apply(caster, caster, this, { duration: this.GetCastPoint() })
        return true
    }
    OnAbilityPhaseInterrupted() {
        modifier_t6_degenerate_particle.remove(this.GetCasterPlus());
        return true
    }
    OnSpellStart() {
        let caster = this.GetCasterPlus()
        modifier_t6_degenerate_particle.remove(caster);
        // BuildSystem.ReplaceBuilding(caster, "t02")
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t6_degenerate_particle extends modifier_particle {
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/towers/degenerate.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetCasterPlus()
            })
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
}