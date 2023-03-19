import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerUnit } from "../../entityPlus/Base_Plus";

@registerUnit()
export class npc_unit_building extends BaseNpc_Plus {
    onSpawned(e: any): void {
        let name = this.GetUnitName();
        GLogHelper.print("npc_unit_building Spawn: " + name)
    }
}

declare global {
    type IBuilding_BaseNpc = npc_unit_building;
}