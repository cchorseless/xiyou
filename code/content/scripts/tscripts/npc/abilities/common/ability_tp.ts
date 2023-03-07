import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility } from "../../entityPlus/Base_Plus";

@registerAbility()
export class ability_tp extends BaseAbility_Plus {
    CastFilterResultLocation(vLocation: Vector) {
        let hCaster = this.GetCasterPlus();
        if (GFuncEntity.IsValid(hCaster)) {
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
        BaseModifier_Plus.CreateBuffThinker(hCaster, this, "modifier_tp_thinker", { duration: this.GetTPDuration() }, vPosition, hCaster.GetTeamNumber(), false);
        return true;
    }
    GetTPDuration() {
        return 1;
    }
    ShowGrid() {
        return 1;
    }
}
