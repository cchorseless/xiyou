import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerUnit } from "../../entityPlus/Base_Plus";
import { modifier_respawn } from "../../modifier/modifier_respawn";
@registerUnit()
export class uint_creature_roamer extends BaseNpc_Plus {
    Spawn(entityKeyValues: CScriptKeyValues) {
        // PrecacheHelper.precachResByKV(entityKeyValues);
    }
    onSpawned(event: NpcSpawnedEvent) {
        if (!IsServer()) { return }

        modifier_respawn.apply(this, this)
    }
}
