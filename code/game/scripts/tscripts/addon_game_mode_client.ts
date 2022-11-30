import { GameEnum } from "./shared/GameEnum";
import { GameFunc } from "./GameFunc";
import { EntityHelper } from "./helper/EntityHelper";
import { EventHelper } from "./helper/EventHelper";
import { KVHelper } from "./helper/KVHelper";
import { LogHelper } from "./helper/LogHelper";
import { SingletonClass } from "./helper/SingletonHelper";
import { BaseNpc_Plus } from "./npc/entityPlus/BaseNpc_Plus";
import { AllEntity } from "./AllEntity";
import { ability_propertytool } from "./npc/propertystat/ability_propertytool";

export class GameMode_Client extends SingletonClass {



    public Init() {
        this.addEvent();
        KVHelper.initKVFile();
    }

    public addEvent() {
        EventHelper.addGameEvent(this, GameEnum.GameEvent.NpcSpawnedEvent, this.OnNPCSpawned);
        EventHelper.addGameEvent(this, "call_get_ability_data", this.OnCall_get_ability_data);
        EventHelper.addGameEvent(this, "call_get_unit_data", this.OnCall_get_unit_data);
        EventHelper.addGameEvent(this, "call_get_player_data", this.OnCall_get_player_data);
    }

    private OnNPCSpawned(e: NpcSpawnedEvent) {
        let spawnedUnit = EntIndexToHScript(e.entindex) as BaseNpc_Plus;
        if (spawnedUnit == null) return;
        let sUnitName = spawnedUnit.GetUnitName();
        if (sUnitName == GameEnum.Unit.UnitNames.npc_dota_thinker) {
            return;
        }
        if (EntityHelper.checkIsFirstSpawn(spawnedUnit)) {
            let className = spawnedUnit.GetClassname();
            if (className == GameEnum.Unit.UnitClass.npc_dota_creature) {
                GameFunc.BindInstanceToCls(spawnedUnit, BaseNpc_Plus);
                // (_G as any).EntityFramework.CreateCppClassProxy(className);
            } else {
            }
            if (spawnedUnit.onSpawned) {
                spawnedUnit.onSpawned(e);
            }
        }
    }

    private OnCall_get_ability_data(e: IGet_ability_data) {
        ability_propertytool.call_level = e.level;
        ability_propertytool.call_key = e.key_name;
        ability_propertytool.call_ability = e.ability_entindex;
    }
    private OnCall_get_unit_data(e: IGet_unit_data) {
        ability_propertytool.call_unit = e.unit_entindex;
        ability_propertytool.call_func = e.func_name;
    }

    private OnCall_get_player_data(e: IGet_player_data) {

    }

}

LogHelper.print("IsClient start ----------------------");
AllEntity.init();
GameMode_Client.GetInstance().Init();
