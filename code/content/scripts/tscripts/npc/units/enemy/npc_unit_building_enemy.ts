import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerUnit } from "../../entityPlus/Base_Plus";

@registerUnit()
export class npc_unit_building_enemy extends BaseNpc_Plus {
    FindEnemyToAttack?(): IBaseNpc_Plus;
    onSpawned(event: NpcSpawnedEvent): void {
        GLogHelper.print(this.GetUnitName(), 11111);
    }
}

declare global {
    type IBuilding_BaseNpcEnemy = npc_unit_building_enemy;
}