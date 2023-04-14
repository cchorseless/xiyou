import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";


@registerAbility()
export class t15_gamble extends BaseAbility_Plus {

    CastFilterResult() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let iPlayerID = hCaster.GetPlayerOwnerID()
            // if (Spawner.IsEndless()) {
            //     this.errorStr = "dota_hud_error_can_not_use_when_endless"
            //     return UnitFilterResult.UF_FAIL_CUSTOM
            // }
            // if (PlayerData.GetGold(iPlayerID) < this.GetGoldCost(this.GetLevel())) {
            //     this.errorStr = "dota_hud_error_gamble_gold_not_enough"
            //     return UnitFilterResult.UF_FAIL_CUSTOM
            // }
        }
        return UnitFilterResult.UF_SUCCESS
    }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hPlayer = hCaster.GetPlayerOwner()
        let iPlayerID = hCaster.GetPlayerOwnerID()
        //  let iGoldCost = this.GetSpecialValueFor("gold_cost")
        //  PlayerData.ModifyGold(iPlayerID, -iGoldCost)
        // CustomGameEventManager.Send_ServerToPlayer(hPlayer, "t15_gamble", {
        //     caster: hCaster.entindex(),
        //     ability: this.entindex(),
        // })
    }
    OnGamble(iGoldCost: number) {
        if (!this.IsCooldownReady()) {
            return
        }
        let hCaster = this.GetCasterPlus()
        let chance = this.GetSpecialValueFor("chance")
        let bonus_gold_factor = this.GetSpecialValueFor("bonus_gold_factor")
        let cool_down = this.GetSpecialValueFor("cool_down")
        let iPlayerID = hCaster.GetPlayerOwnerID()
        let hModifier = modifier_t15_gamble.findIn(hCaster)
        let hModifierNegative = modifier_t15_gamble_negative.findIn(hCaster) as modifier_t15_gamble_negative;
        if (iGoldCost <= 0) {
            // ErrorMessage(iPlayerID, "dota_hud_error_gamble_gold_not_enough")
            return
        }
        // if (PlayerData.GetGold(iPlayerID) - iGoldCost < 0) {
        //     ErrorMessage(iPlayerID, "dota_hud_error_gamble_gold_not_enough")
        //     return
        // }
        // PlayerData.ModifyGold(iPlayerID, -iGoldCost)
        let iTotalGold = IsValid(hModifierNegative) && -hModifierNegative.GetStackCount() || hModifier.GetStackCount()
        this.StartCooldown(cool_down)
        let EffectName = null
        if (RandomFloat(0, 100) <= chance) {
            hCaster.EmitSound("ui.treasure_02")

            // let iGold = iGoldCost * bonus_gold_factor
            // PlayerData.ModifyGold(iPlayerID, iGold)
            // SendOverheadEventMessage(hCaster.GetPlayerOwner(), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_GOLD, hCaster, iGold, null)

            // let iGainGold = math.floor((iGold - iGoldCost))
            // iTotalGold = iTotalGold + iGainGold
            // //  通知
            // Notification.Combat({
            //     player_id: iPlayerID,
            //     string_ability_name: "DOTA_Tooltip_Ability_" + this.GetAbilityName(),
            //     string_gold_number: iGainGold,
            //     message: "Custom_Gamble_Succes.length",
            // })
            // PlayerData.playerDatas[iPlayerID].statistics.gold = PlayerData.playerDatas[iPlayerID].statistics.gold + iGainGold
            EffectName = "particles/econ/items/antimage/antimage_weapon_basher_ti5_gold/antimage_manavoid_ti_5_gold.vpcf"
        } else {
            hCaster.EmitSound("Frostivus.PointScored.Enemy")
            // //  通知
            // Notification.Combat({
            //     player_id: iPlayerID,
            //     string_ability_name: "DOTA_Tooltip_Ability_" + this.GetAbilityName(),
            //     string_gold_number: math.floor(iGoldCost),
            //     message: "Custom_Gamble_Fail.length",
            // })
            // iTotalGold = iTotalGold - iGoldCost
            // PlayerData.playerDatas[iPlayerID].statistics.gold = PlayerData.playerDatas[iPlayerID].statistics.gold - math.floor(iGoldCost)
            EffectName = "particles/econ/items/antimage/antimage_weapon_basher_ti5_gold/am_manaburn_basher_ti_5_gold.vpcf"
        }
        let nIndexFX = ResHelper.CreateParticle({
            resPath: EffectName,
            resNpc: null,
            iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
            owner: hCaster
        });

        ParticleManager.ReleaseParticleIndex(nIndexFX)

        hModifier.SetStackCount(math.max(iTotalGold, 0))
        if (iTotalGold < 0) {
            if (!IsValid(hModifierNegative)) {
                hModifierNegative = modifier_t15_gamble_negative.apply(hCaster, hCaster, this, null) as modifier_t15_gamble_negative
            }
            hModifierNegative.SetStackCount(-iTotalGold)
        } else {
            modifier_t15_gamble_negative.remove(hCaster);
        }
    }
    GetIntrinsicModifierName() {
        return "modifier_t15_gamble"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t15_gamble extends BaseModifier_Plus {
    hParticleModifier: modifier_t15_gamble_particle_bounty_hunter_hoard_shield;
    IsHidden() {
        return modifier_t15_gamble_negative.exist(this.GetCasterPlus()) || this.GetStackCount() == 0
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
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            this.StartIntervalThink(0)
        }
    }

    BeDestroy() {

        if (IsServer()) {
            if (IsValid(this.hParticleModifier)) {
                this.hParticleModifier.Destroy()
            }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hAbility = this.GetAbilityPlus()
            let hCaster = this.GetCasterPlus()

            if (!IsValid(hCaster) || !IsValid(hAbility)) {
                this.Destroy()
                return
            }
            if (hCaster.IsTempestDouble() || hCaster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }
            // && !Spawner.IsEndless()
            if (hAbility.IsActivated() && hAbility.IsCooldownReady()) {
                if (!IsValid(this.hParticleModifier)) {
                    this.hParticleModifier = modifier_t15_gamble_particle_bounty_hunter_hoard_shield.apply(hCaster, hCaster, hAbility, null) as modifier_t15_gamble_particle_bounty_hunter_hoard_shield
                }
            } else {
                if (IsValid(this.hParticleModifier)) {
                    this.hParticleModifier.Destroy()
                }
            }

            this.StartIntervalThink(hAbility.GetCooldownTimeRemaining())
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t15_gamble_negative extends BaseModifier_Plus {
    IsHidden() {
        return false
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
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t15_gamble_particle_bounty_hunter_hoard_shield extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let nIndexFX = ResHelper.CreateParticle({
                resPath: "particles/econ/items/bounty_hunter/bounty_hunter_hunters_hoard/bounty_hunter_hoard_shield.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(nIndexFX, 0, hCaster, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(nIndexFX, 1, hCaster, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(nIndexFX, 2, hCaster, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            this.AddParticle(nIndexFX, false, false, -1, false, false)
        }
    }

}