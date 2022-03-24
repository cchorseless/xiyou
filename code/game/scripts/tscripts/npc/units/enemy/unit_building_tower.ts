import { LogHelper } from "../../../helper/LogHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerUnit } from "../../entityPlus/Base_Plus";
import { modifier_respawn } from "../../modifier/modifier_respawn";
/**防御塔 */
@registerUnit()
export class unit_building_tower extends BaseNpc_Plus {
    Spawn(entityKeyValues: CScriptKeyValues) {
        // PrecacheHelper.precachResByKV(entityKeyValues);
    }
    onSpawned(event: NpcSpawnedEvent) {
        if (!IsServer()) { return }

        this.addTimer(2, () => {
            // this.ForceKill(false);
            // this.Destroy()
            // this.SafeDestroy()
            // LogHelper.print(this.IsNull(), 1111)
            // this.SafeDestroy()
            // this.GetOwner().RemoveSelf
        })
    }
}
