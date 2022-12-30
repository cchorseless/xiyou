
    import { PrecacheHelper } from "../../../../helper/PrecacheHelper";
    import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
    import { registerUnit } from "../../../entityPlus/Base_Plus";
import { IBuilding_BaseNpc} from "../Building_BaseNpc";
    
    @registerUnit()
    export class building_hero_t34 extends BaseNpc_Plus implements IBuilding_BaseNpc{
        Spawn(entityKeyValues: CScriptKeyValues) {
            // PrecacheHelper.precachResByKV(entityKeyValues);
        }
        onSpawned(event: NpcSpawnedEvent) {
        }
    }
    