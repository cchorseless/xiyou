import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerUnit } from "../../entityPlus/Base_Plus";

@registerUnit()
export class npc_unit_building extends BaseNpc_Plus {
    FindEnemyToAttack?(): IBaseNpc_Plus;
    onSpawned(event: NpcSpawnedEvent): void {
        GLogHelper.print(this.GetUnitName(), this.GetName(), 11111);
    }
}

declare global {
    type IBuilding_BaseNpc = npc_unit_building;
}