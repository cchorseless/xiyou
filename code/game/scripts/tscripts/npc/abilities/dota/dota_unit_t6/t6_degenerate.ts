import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { EntityHelper } from "../../../../helper/EntityHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { BaseNpc_Hero_Plus } from "../../../entityPlus/BaseNpc_Hero_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { modifier_shock } from "../../../modifier/effect/modifier_shock";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
import { modifier_particle, modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { LogHelper } from "../../../../helper/LogHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";


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
    OnCreated(params: ModifierTable) {
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