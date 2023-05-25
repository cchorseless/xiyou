import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

// 行动受限的标识
@registerModifier()
export class modifier_unit_hut extends BaseModifier_Plus {
    IsPurgable() {
        return false;
    }
    IsPurgeException() {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }


    CheckState() {
        let hParent = this.GetParentPlus();
        // 敌方单位缴械
        let iscanselect = hParent.GetTeamNumber() == DOTATeam_t.DOTA_TEAM_BADGUYS;
        let state = {
            [modifierstate.MODIFIER_STATE_DISARMED]: iscanselect,
        };
        return state
    }

}
