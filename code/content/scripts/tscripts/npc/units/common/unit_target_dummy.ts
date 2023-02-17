import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerUnit } from "../../entityPlus/Base_Plus";
/**伤害点 */
@registerUnit()
export class unit_target_dummy extends BaseNpc_Plus {
    Spawn(entityKeyValues: CScriptKeyValues) {
        // PrecacheHelper.precachResByKV(entityKeyValues);
    }
    onSpawned(event: NpcSpawnedEvent) {

    }
}