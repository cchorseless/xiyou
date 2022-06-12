import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { ET } from "../../../rules/Entity/Entity";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerUnit } from "../../entityPlus/Base_Plus";
import { modifier_portal } from "../../modifier/modifier_portal";
/**传送门 */
@registerUnit()
export class unit_portal extends BaseNpc_Plus {
    Precache(context: CScriptPrecacheContext) {
        // PrecacheHelper.precachResByKV(entityKeyValues);
    }

    Spawn(entityKeyValues: CScriptKeyValues) {
        LogHelper.print("Spawn", this.entindex(),this.GetUnitName());
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
            ET.Handler.create(this, () => {
                let sPosition = vTargetPosition.x + " " + vTargetPosition.y + " " + vTargetPosition.z;
                modifier_portal.applyOnly(hPortal, hPortal, null, { vPosition: sPosition });
            })
        );
        return hPortal;
    }
}
