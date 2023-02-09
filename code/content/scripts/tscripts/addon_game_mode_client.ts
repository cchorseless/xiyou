// LogHelper必须放第一行先导入
import { AllEntity } from "./AllEntity";
import { GameCache } from "./GameCache";
import { GameFunc } from "./GameFunc";
import { EntityHelper } from "./helper/EntityHelper";
import { EventHelper } from "./helper/EventHelper";
import { KVHelper } from "./helper/KVHelper";
import { LogHelper } from "./helper/LogHelper";
import { TimerHelper } from "./helper/TimerHelper";
import { BaseNpc_Plus } from "./npc/entityPlus/BaseNpc_Plus";
import { GameEnum } from "./shared/GameEnum";
import { GameProtocol } from "./shared/GameProtocol";
import { SingletonClass } from "./shared/lib/SingletonClass";

@GReloadable
export class GameMode_Client extends SingletonClass {

    public Init() {
        this.addEvent();
        KVHelper.initKVFile();
        this.PreLoadLua();
    }

    public PreLoadLua() {
        for (let k in KVHelper.KvUnits) {
            let kv = KVHelper.KvUnits[k] as { vscripts: string };
            if (kv && type(kv) == "table" && kv.vscripts && kv.vscripts != "" && type(kv.vscripts) == "string") {
                try {
                    require(kv.vscripts.replace(".lua", ""));
                }
                catch (err) {
                    GLogHelper.warn(err);
                }
            }
        }
        for (let k in KVHelper.KvAbilitys) {
            let kv = KVHelper.KvAbilitys[k] as { ScriptFile: string };
            if (kv && type(kv) == "table" && kv.ScriptFile && kv.ScriptFile != "" && type(kv.ScriptFile) == "string") {
                try {
                    require(kv.ScriptFile.replace(".lua", ""));
                }
                catch (err) {
                    GLogHelper.warn(err);
                }
            }
        }
        for (let k in KVHelper.KvItems) {
            let kv = KVHelper.KvItems[k] as { ScriptFile: string };
            if (kv && type(kv) == "table" && kv.ScriptFile && kv.ScriptFile != "" && type(kv.ScriptFile) == "string") {
                try {
                    require(kv.ScriptFile.replace(".lua", ""));
                }
                catch (err) {
                    GLogHelper.warn(err);
                }
            }
        }
    }

    public addEvent() {
        EventHelper.addGameEvent(GameEnum.GameEvent.client_reload_game_keyvalues, GHandler.create(this, (e) => this.OnReload(e)));
        EventHelper.addGameEvent(GameEnum.GameEvent.NpcSpawnedEvent, GHandler.create(this, (e) => this.OnNPCSpawned(e)));
        EventHelper.addGameEvent(GameProtocol.Protocol.custom_call_get_ability_data, GHandler.create(this, (e) => this.OnCall_get_ability_data(e)));
        EventHelper.addGameEvent(GameProtocol.Protocol.custom_call_get_unit_data, GHandler.create(this, (e) => this.OnCall_get_unit_data(e)));
        EventHelper.addGameEvent(GameProtocol.Protocol.custom_call_get_player_data, GHandler.create(this, (e) => this.OnCall_get_player_data(e)));

    }
    private OnReload(e: any) {
        EventHelper.removeGameEventCaller(this);
        require("addon_game_mode_client");
        GGameCache.DebugReload();
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
                let cls = GGetRegClass<typeof BaseNpc_Plus>(sUnitName) || BaseNpc_Plus;
                GameFunc.BindInstanceToCls(spawnedUnit, cls);
                if (spawnedUnit.onSpawned) {
                    spawnedUnit.onSpawned(e);
                }
            }
        }
    }

    private OnCall_get_ability_data(e: IGet_ability_data) {
        GPropertyCalculate.call_level = e.level;
        GPropertyCalculate.call_key = e.key_name;
        GPropertyCalculate.call_ability = e.ability_entindex;
    }
    private OnCall_get_unit_data(e: IGet_unit_data) {
        GPropertyCalculate.call_unit = e.unit_entindex;
        GPropertyCalculate.call_func = e.func_name;
    }

    private OnCall_get_player_data(e: IGet_player_data) {

    }

}

LogHelper.print("IsClient start ----------------------");
GameCache.Init();
AllEntity.Init();
TimerHelper.Init();
GameMode_Client.GetInstance().Init();
