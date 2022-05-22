import { GameEnum } from "./GameEnum";
import { GameFunc } from "./GameFunc";
import { EntityHelper } from "./helper/EntityHelper";
import { EventHelper } from "./helper/EventHelper";
import { KVHelper } from "./helper/KVHelper";
import { LogHelper } from "./helper/LogHelper";
import { SingletonClass } from "./helper/SingletonHelper";
import { BaseNpc_Hero_Plus } from "./npc/entityPlus/BaseNpc_Hero_Plus";
import { BaseNpc_Plus } from "./npc/entityPlus/BaseNpc_Plus";
import { AllEntity } from "./AllEntity";

class GameMode_Client extends SingletonClass {
    public Init() {
        this.addEvent();
        KVHelper.initKVFile();
    }

    public addEvent() {
        // for (let k in GameEnum.Event.GameEvent) {
        //     let eventName = (GameEnum.Event.GameEvent as any)[k];
        //     if (eventName) {
        //         ListenToGameEvent(
        //             eventName,
        //             (e) => {
        //                 LogHelper.print(k, "|", eventName);
        //             },
        //             null
        //         );
        //     }
        // }
        EventHelper.addClientGameEvent(this, GameEnum.Event.GameEvent.NpcSpawnedEvent, this.OnNPCSpawned);
    }

    public OnNPCSpawned(e: NpcSpawnedEvent) {
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
}

LogHelper.print("IsClient start ----------------------");
AllEntity.init();
GameMode_Client.GetInstance().Init();
// (_G as any).EntityFramework.CreateCppClassProxy('dota_hero_zuus');

// EntityMixins = {}
// EntityClasses = {}
// EntityLinkClasses = {}
// EntityClassNameOverrides = {}
// EntityDesignerNameToClassname = {}
// EntityFramework = {}
// EntityUtils = {}
// LogHelper.print('EntityMixins:', (_G as any).EntityMixins)
// LogHelper.print('EntityClasses:', (_G as any).EntityClasses)
// LogHelper.print('EntityLinkClasses:', (_G as any).EntityLinkClasses)
// LogHelper.print('EntityDesignerNameToClassname:', (_G as any).EntityDesignerNameToClassname)
// LogHelper.print('EntityClassNameOverrides:', (_G as any).EntityClassNameOverrides)
// LogHelper.print('EntityFramework:', (_G as any).EntityFramework)
// LogHelper.print('GameDataObj:', (_G as any).GameDataObj)
// LogHelper.print('EntityUtils:', (_G as any).dota_hero_zuus, 11);
