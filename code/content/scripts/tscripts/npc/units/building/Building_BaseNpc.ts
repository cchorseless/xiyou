import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";

export class Building_BaseNpc extends BaseNpc_Plus {
    FindEnemyToAttack?(): IBaseNpc_Plus;
    onSpawned(event: NpcSpawnedEvent): void {
        GLogHelper.print(this.GetUnitName(), 11111);
    }
}

declare global {
    type IBuilding_BaseNpc = Building_BaseNpc;
}