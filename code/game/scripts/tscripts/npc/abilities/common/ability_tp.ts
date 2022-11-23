import { GameEnum } from "../../../shared/GameEnum";
import { GameFunc } from "../../../GameFunc";
import { EntityHelper } from "../../../helper/EntityHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_test } from "../../modifier/modifier_test";

@registerAbility()
export class ability_tp extends BaseAbility_Plus {
    CastFilterResultLocation(vLocation: Vector) {
        let hCaster = this.GetCasterPlus();
        if (GameFunc.IsValid(hCaster)) {
            if (IsServer()) {
                if (!this.ValidPosition(vLocation)) {
                    this.errorStr = "dota_hud_error_cant_build_at_location";
                    return UnitFilterResult.UF_FAIL_CUSTOM;
                }
            }
            return UnitFilterResult.UF_SUCCESS;
        }
        this.errorStr = "dota_hud_error_only_building_can_use";
        return UnitFilterResult.UF_FAIL_CUSTOM;
    }
    ValidPosition(vPosition: Vector) {
        let hCaster = this.GetCasterPlus();
        let sUnique = null;
        // if (hCaster.GetBuilding) {
        //     let hBuilding = hCaster.GetBuilding();
        //     if (hBuilding) {
        //         sUnique = hBuilding.GetBlockerEntity();
        //     }
        // }
        // SnapToGrid(BUILDING_SIZE, vPosition);
        // if (!BuildSystem.ValidPosition(BUILDING_SIZE, vPosition, sUnique)) {
        //     return false;
        // }
        return true;
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus();
        let vPosition = this.GetCursorPosition();
        if (!this.ValidPosition(vPosition)) {
            return false;
        }

        CreateModifierThinker(hCaster, this, "modifier_tp_thinker", { duration: this.GetTPDuration() }, vPosition, hCaster.GetTeamNumber(), false);

        return true;
    }
    GetTPDuration() {
        return 1;
    }
    ShowGrid() {
        return 1;
    }
}
