import { LogHelper } from "../../../helper/LogHelper";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerUnit } from "../../entityPlus/Base_Plus";
import { modifier_portal } from "../../modifier/modifier_portal";
/**传送门 */
@registerUnit()
export class unit_portal extends BaseNpc_Plus {

    Spawn(entityKeyValues: CScriptKeyValues) {
        LogHelper.print("Spawn", this.entindex(), this.GetUnitName());
    }
    onSpawned(event: NpcSpawnedEvent) {
        if (!IsServer()) {
            return;
        }
    }
    sPortalName: string;
    static CreatePortal(vPortalPosition: Vector, vTargetPosition: Vector, vForward: Vector, sPortalName: string, team: DOTATeam_t = DOTATeam_t.DOTA_TEAM_GOODGUYS, bHasArrow: boolean = false) {
        let hPortal = unit_portal.CreateOne(vPortalPosition, team, true, null, null);
        hPortal.sPortalName = sPortalName;
        hPortal.SetForwardVector(vForward);
        hPortal.addSpawnedHandler(
            GHandler.create(this, () => {
                let sPosition = vTargetPosition.x + " " + vTargetPosition.y + " " + vTargetPosition.z;
                modifier_portal.applyOnly(hPortal, hPortal, null, { vPosition: sPosition });
            })
        );
        return hPortal;
    }
}
