import { KVHelper } from "../../../helper/KVHelper";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerUnit } from "../../entityPlus/Base_Plus";

@registerUnit()
export class npc_unit_building_enemy extends BaseNpc_Plus {
    FindEnemyToAttack?(): IBaseNpc_Plus;
    onSpawned(event: NpcSpawnedEvent): void {
        if (IsServer()) {
            let AmbientModifiers = KVHelper.GetUnitData(this.GetUnitName(), "AmbientModifiers") as string;
            if (AmbientModifiers) {
                GLogHelper.print("AmbientModifiers", AmbientModifiers)
                let modifiers = AmbientModifiers.split(",");
                modifiers.forEach(modifierName => {
                    this.AddNewModifier(this, null, modifierName, {})
                });
            }
        }
    }
}

declare global {
    type IBuilding_BaseNpcEnemy = npc_unit_building_enemy;
}