import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerUnit } from "../../entityPlus/Base_Plus";
/**防御塔 */
@registerUnit()
export class unit_building_tower extends BaseNpc_Plus {
    Spawn(entityKeyValues: CScriptKeyValues) {
        // PrecacheHelper.precachResByKV(entityKeyValues);
    }
    onSpawned(event: NpcSpawnedEvent) {
        if (!IsServer()) { return }

        GTimerHelper.AddTimer(2, GHandler.create(this, () => {
            // this.ForceKill(false);
            // this.Destroy()
            // this.SafeDestroy()
            // LogHelper.print(this.IsNull(), 1111)
            // this.SafeDestroy()
            // this.GetOwner().RemoveSelf
        }))
    }
}
