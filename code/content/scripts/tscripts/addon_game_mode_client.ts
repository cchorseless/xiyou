// LogHelper必须放第一行先导入
import { AllEntity } from "./AllEntity";
import { GameCache } from "./GameCache";
import { GameFunc } from "./GameFunc";
import { EntityHelper } from "./helper/EntityHelper";
import { EventHelper } from "./helper/EventHelper";
import { KVHelper } from "./helper/KVHelper";
import { LogHelper } from "./helper/LogHelper";
import { BaseNpc_Plus } from "./npc/entityPlus/BaseNpc_Plus";
import { ability_propertytool } from "./npc/propertystat/ability_propertytool";
import { GameEnum } from "./shared/GameEnum";
import { SingletonClass } from "./shared/lib/SingletonClass";

export class GameMode_Client extends SingletonClass {


    public Init() {
        this.addEvent();
        KVHelper.initKVFile();
    }

    public addEvent() {
        EventHelper.addGameEvent(GameEnum.GameEvent.NpcSpawnedEvent, GHandler.create(this, this.OnNPCSpawned));
        EventHelper.addGameEvent(GameEnum.CustomCallClientLua.call_get_ability_data, GHandler.create(this, this.OnCall_get_ability_data));
        EventHelper.addGameEvent(GameEnum.CustomCallClientLua.call_get_unit_data, GHandler.create(this, this.OnCall_get_unit_data));
        EventHelper.addGameEvent(GameEnum.CustomCallClientLua.call_get_player_data, GHandler.create(this, this.OnCall_get_player_data));
    }

    private OnNPCSpawned(e: NpcSpawnedEvent) {
        let spawnedUnit = EntIndexToHScript(e.entindex) as IBaseNpc_Plus;
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
GameCache.Init();
AllEntity.Init();
GameMode_Client.GetInstance().Init();
