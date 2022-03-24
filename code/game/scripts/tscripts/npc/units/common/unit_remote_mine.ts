import { LogHelper } from "../../../helper/LogHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerUnit } from "../../entityPlus/Base_Plus";
import { modifier_respawn } from "../../modifier/modifier_respawn";
/**炸弹人远程炸弹 */
@registerUnit()
export class unit_remote_mine extends BaseNpc_Plus {
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

