import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerUnit } from "../../entityPlus/Base_Plus";

@registerUnit()
export class npc_unit_comon extends BaseNpc_Plus {
    onSpawned(event: NpcSpawnedEvent): void {
        // GLogHelper.print(this.GetUnitName(), 22222);
    }
}

