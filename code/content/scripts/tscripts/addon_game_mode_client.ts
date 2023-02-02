// LogHelper必须放第一行先导入
import { AllEntity } from "./AllEntity";
import { GameCache } from "./GameCache";
import { GameFunc } from "./GameFunc";
import { EntityHelper } from "./helper/EntityHelper";
import { EventHelper } from "./helper/EventHelper";
import { KVHelper } from "./helper/KVHelper";
import { LogHelper } from "./helper/LogHelper";
import { BaseNpc_Plus } from "./npc/entityPlus/BaseNpc_Plus";
import { modifier_property } from "./npc/propertystat/modifier_property";
import { GameEnum } from "./shared/GameEnum";
import { GameProtocol } from "./shared/GameProtocol";
import { SingletonClass } from "./shared/lib/SingletonClass";

export class GameMode_Client extends SingletonClass {


    public Init() {
        this.addEvent();
        KVHelper.initKVFile();
    }

    public addEvent() {
        EventHelper.addGameEvent(GameEnum.GameEvent.client_reload_game_keyvalues, GHandler.create(this, this.OnReload));
        EventHelper.addGameEvent(GameEnum.GameEvent.NpcSpawnedEvent, GHandler.create(this, this.OnNPCSpawned));
        EventHelper.addGameEvent(GameProtocol.Protocol.call_get_ability_data, GHandler.create(this, this.OnCall_get_ability_data));
        EventHelper.addGameEvent(GameProtocol.Protocol.call_get_unit_data, GHandler.create(this, this.OnCall_get_unit_data));
        EventHelper.addGameEvent(GameProtocol.Protocol.call_get_player_data, GHandler.create(this, this.OnCall_get_player_data));

    }

    private OnReload(e: any) {
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
        modifier_property.call_level = e.level;
        modifier_property.call_key = e.key_name;
        modifier_property.call_ability = e.ability_entindex;
    }
    private OnCall_get_unit_data(e: IGet_unit_data) {
        modifier_property.call_unit = e.unit_entindex;
        modifier_property.call_func = e.func_name;
    }

    private OnCall_get_player_data(e: IGet_player_data) {

    }

}

LogHelper.print("IsClient start ----------------------");
GameCache.Init();
AllEntity.Init();
GameMode_Client.GetInstance().Init();
