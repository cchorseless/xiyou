
import { BattleHelper } from "../../../helper/BattleHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility } from "../../entityPlus/Base_Plus";

@registerAbility()
export class item_towerchange_custom extends BaseItem_Plus {

    GetBehavior() {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_CHANNELLED
    }

    CastFilterResultTarget(hTarget: BaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        if (hTarget.IsBuilding() && hTarget.GetTeamNumber() != hCaster.GetTeamNumber()) {
            return UnitFilterResult.UF_SUCCESS
        }
        this.errorStr = "dota_hud_error_only_can_cast_on_same_hero"
        return UnitFilterResult.UF_FAIL_CUSTOM
    }
    GetCustomCastErrorTarget() {
        return this.errorStr
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return 600
    }

    GetManaCost() {
        return 0
    }
    GetChannelTime() {
        return 10
    }
    GetCooldown() {
        return 2
    }
    GetShareability() {
        return EShareAbility.ITEM_FULLY_SHAREABLE
    }
    OnSpellStart() {
        // this.GetCasterPlus().RemoveItem(this);
    }
    damageInfo: BattleHelper.DamageOptions = {
        attacker: null,
        damage: 1,
        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
        ability: null,
        victim: null,
    }

    OnAbilityPhaseInterrupted() {
    }

    OnChannelThink() {
        let curcharge = this.GetCurrentCharges();
        if (curcharge == 0) {
            this.EndChannel(true);
            this.GetCasterPlus().RemoveItem(this)
            return
        }
        this.SetCurrentCharges(curcharge - 1);
        this.damageInfo.victim = this.GetCursorTarget()
        this.damageInfo.attacker = this.GetCasterPlus()
        this.damageInfo.ability = this
        BattleHelper.GoApplyDamage(this.damageInfo)
    }
    IsStackable() {
        return true
    }
    OnChannelFinish(b: boolean) {
        if (b) {
            return
        }
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget();
        if (hTarget.IsBuilding() && hTarget.GetTeamNumber() != hCaster.GetTeamNumber()) {
            hTarget.SetTeam(hCaster.GetTeamNumber())

        }
    }
}
