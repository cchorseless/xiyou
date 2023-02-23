
import { MiniMapHelper } from "../../../helper/MiniMapHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
/**标记 */
@registerAbility()
export class ability6_courier_base extends BaseAbility_Plus {
    GetBehavior() {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET
    }


    GetAbilityTargetTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY
    }

    GetAbilityTargetType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
    }

    GetCooldown() {
        return 5
    }

    GetManaCost() {
        return 50
    }

    OnSpellStart() {
        let hTarget = this.GetCursorTarget();
        let hCaster = this.GetCasterPlus()
        let iParticleID = ResHelper.CreateParticle(
            {
                resPath: "particles/units/heroes/hero_bounty_hunter/bounty_hunter_track_cast.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN
            })
        ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_weapon2", hCaster.GetAbsOrigin(), true)
        ParticleManager.SetParticleControlEnt(iParticleID, 1, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
        ParticleManager.ReleaseParticleIndex(iParticleID);
        EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_BountyHunter.Target", hCaster), hCaster)
        modifier_biaoji.apply(hTarget, hCaster, this, {
            duration: 30
        })

    }
}

@registerModifier()
export class modifier_biaoji extends BaseModifier_Plus {
    /**是否隐藏 */
    public IsHidden() { return false }
    /**是否是debuff */
    public IsDebuff() { return true }
    GetAttributes() {
        /**可以同时拥有多个 */
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }

    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let iParticleID = ResHelper.CreateParticle(
                {
                    resPath: "particles/units/heroes/hero_bounty_hunter/bounty_hunter_track_shield.vpcf",
                    owner: hParent,
                    iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW
                })
            this.AddParticle(iParticleID, false, false, -1, false, true);

            iParticleID = ResHelper.CreateParticle(
                {
                    resPath: "particles/units/heroes/hero_bounty_hunter/bounty_hunter_track_trail.vpcf",
                    owner: hParent,
                    iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
                })
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
        else {
            MiniMapHelper.updatePlayerOnMiniForPlayer(this.GetParentPlus().GetPlayerOwnerID(), this.GetCasterPlus().GetPlayerOwnerID())
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    GetVision() {
        return 1
    }


    BeDestroy() {

        MiniMapHelper.noshowPlayerOnMiniForPlayer(this.GetParentPlus().GetPlayerOwnerID(), this.GetCasterPlus().GetPlayerOwnerID())
    }
}



