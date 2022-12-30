
    import { PrecacheHelper } from "../../../../helper/PrecacheHelper";
    import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
    import { registerUnit } from "../../../entityPlus/Base_Plus";
    
    @registerUnit()
    export class wave_goldx3 extends BaseNpc_Plus {
        Spawn(entityKeyValues: CScriptKeyValues) {
            // PrecacheHelper.precachResByKV(entityKeyValues);
        }
        onSpawned(event: NpcSpawnedEvent) {
        }
    }
    