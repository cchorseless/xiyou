
import { GameFunc } from "../../../GameFunc";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

// 残影
@registerModifier()
export class modifier_remnant extends BaseModifier_Plus {
    Init(par: ModifierTable) {
        this.ReleaseRemnant();
    }

    remnants: IBaseNpc_Plus[] = [];
    ReleaseRemnant(vPosition: Vector = null) {
        let hCaster = this.GetParentPlus();
        vPosition = vPosition || hCaster.GetAbsOrigin();
        let hThinker = BaseNpc_Plus.CreateUnitByName(hCaster.GetUnitName(), vPosition, hCaster.GetTeamNumber(), false, hCaster, hCaster);
        this.remnants.push(hThinker);
        hThinker.SetForwardVector(hCaster.GetForwardVector());
        hThinker.StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_CAST_ABILITY_1, 1.5);
        for (let i = hThinker.GetAbilityCount() - 1; i >= 0; i--) {
            let ability = hThinker.GetAbilityByIndex(i);
            if (GameFunc.IsValid(ability)) {
                hThinker.RemoveAbilityByHandle(ability);
            }
        }
        modifier_remnant_thinker.applyOnly(hThinker, hCaster);
        FindClearSpaceForUnit(hThinker, vPosition, false);
        hCaster.EmitSound("Hero_StormSpirit.StaticRemnantPlant");
    }

    public OnDestroy(): void {
        super.OnDestroy();
        for (let k of this.remnants) {
            k.SafeDestroy()
        }
        this.remnants = [];
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_remnant_thinker extends BaseModifier_Plus {
    IsPurgable() {
        return false;
    }
    IsPurgeException() {
        return false;
    }
    iParticleSize: number = 1000;
    // todo
    Init(params: ModifierTable) {
        // let hParent = this.GetParentPlus();
        // let iParticleID = ResHelper.CreateParticle(
        //     //  "particles/units/towers/stormspirit/status_fx_remnant.vpcf"
        //     new ResHelper.ParticleInfo()
        //         .set_resPath("particles/units/heroes/hero_stormspirit/stormspirit_static_remnant.vpcf")
        //         .set_owner(hParent)
        //         .set_iAttachment(ParticleAttachment_t.PATTACH_INVALID)
        // );
        // let pos = hParent.GetAbsOrigin();
        // ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", pos, true);
        // ParticleManager.SetParticleControl(iParticleID, 2, Vector(RandomInt(37, 52), 1, 100));
        // ParticleManager.SetParticleControl(iParticleID, 11, pos);
    }

    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let hParent = this.GetParentPlus();
            let vPosition = hParent.GetAbsOrigin();
            if (GameFunc.IsValid(hParent)) {
                EmitSoundOnLocationWithCaster(vPosition, "Hero_StormSpirit.StaticRemnantExplode", hParent);
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_FROZEN]: true,
        };
    }
}
