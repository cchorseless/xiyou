import { KVHelper } from "../../../../helper/KVHelper";
import { PrecacheHelper } from "../../../../helper/PrecacheHelper";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerUnit } from "../../../entityPlus/Base_Plus";
import { IBuilding_BaseNpc } from "../Building_BaseNpc";

@registerUnit()
export class building_hero_ursa extends BaseNpc_Plus implements IBuilding_BaseNpc {
    Spawn(entityKeyValues: CScriptKeyValues) {}
    onSpawned(event: NpcSpawnedEvent) {}
}
