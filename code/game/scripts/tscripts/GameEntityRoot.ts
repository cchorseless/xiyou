/**
 * 解决循环引用折中方案，出现循环应用，这里添加引用后，再引用该模块。
 * 弃用，采用缓存类的形式
 */

import { GameEnum } from "./GameEnum";
import { EventHelper } from "./helper/EventHelper";
import { LogHelper } from "./helper/LogHelper";
import { NetTablesHelper } from "./helper/NetTablesHelper";
import { PrecacheHelper } from "./helper/PrecacheHelper";
import { ET } from "./rules/Entity/Entity";
import { BuildingSystemComponent } from "./rules/System/Building/BuildingSystemComponent";
import { ChessControlSystemComponent } from "./rules/System/ChessControl/ChessControlSystemComponent";
import { CombinationSystemComponent } from "./rules/System/Combination/CombinationSystem";
import { DrawSystemComponent } from "./rules/System/Draw/DrawSystemComponent";
import { EnemySystemComponent } from "./rules/System/Enemy/EnemySystemComponent";
import { MapSystemComponent } from "./rules/System/Map/MapSystemComponent";
import { PlayerSystemComponent } from "./rules/System/Player/PlayerSystemComponent";
import { RoundSystemComponent } from "./rules/System/Round/RoundSystemComponent";
import { WearableSystemComponent } from "./rules/System/Wearable/WearableSystemComponent";
import { TServerZone } from "./service/serverzone/TServerZone";

/**
 * 避免循环加载导入模块，尽量避免用.文件路径更改需要批量替换
 * @param s 文件路径
 */
// function requirePlus<T>(s: string) {
//     s = string.gsub(s, "/", ".")[0];
//     let nameList = s.split('.')
//     return require(s)[nameList[nameList.length - 1]] as T
// }

// import { item_towerchange_custom } from "./npc/items/avalon/item_towerchange_custom";
// export const _item_towerchange_custom = () => {
//     return requirePlus<typeof item_towerchange_custom>("npc/items/avalon/item_towerchange_custom")
// };

export class GameEntityRoot extends ET.EntityRoot {
    init() {
        this.AddComponent(PrecacheHelper.GetRegClass<typeof PlayerSystemComponent>("PlayerSystemComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof MapSystemComponent>("MapSystemComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof DrawSystemComponent>("DrawSystemComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof ChessControlSystemComponent>("ChessControlSystemComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof RoundSystemComponent>("RoundSystemComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof EnemySystemComponent>("EnemySystemComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof BuildingSystemComponent>("BuildingSystemComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof CombinationSystemComponent>("CombinationSystemComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof WearableSystemComponent>("WearableSystemComponent"));
        this.addEvent();
    }
    TServerZone() {
        return this.GetComponentByName<TServerZone>("TServerZone");
    }

    PlayerSystem() {
        return this.GetComponentByName<PlayerSystemComponent>("PlayerSystemComponent");
    }
    MapSystem() {
        return this.GetComponentByName<MapSystemComponent>("MapSystemComponent");
    }
    RoundSystem() {
        return this.GetComponentByName<RoundSystemComponent>("RoundSystemComponent");
    }

    DrawSystem() {
        return this.GetComponentByName<DrawSystemComponent>("DrawSystemComponent");
    }

    CombinationSystem() {
        return this.GetComponentByName<CombinationSystemComponent>("CombinationSystemComponent");
    }
    BuildingSystem() {
        return this.GetComponentByName<BuildingSystemComponent>("BuildingSystemComponent");
    }
    ChessControlSystem() {
        return this.GetComponentByName<ChessControlSystemComponent>("ChessControlSystemComponent");
    }
    EnemySystem() {
        return this.GetComponentByName<EnemySystemComponent>("EnemySystemComponent");
    }

    WearableSystem() {
        return this.GetComponentByName<WearableSystemComponent>("WearableSystemComponent");
    }

    private addEvent() {
        EventHelper.addGameEvent(this, GameEnum.Event.GameEvent.game_rules_state_change, async (e) => {
            const nNewState = GameRules.State_Get();
            LogHelper.print("OnGameRulesStateChange", nNewState);
            switch (nNewState) {
                case DOTA_GameState.DOTA_GAMERULES_STATE_INIT:
                    // GameDebugger.addDebuggerData(GameEnum.Debugger.globalData.DOTA_GAMERULES_STATE_INIT, GetSystemTimeMS() / 1000);
                    break;
                case DOTA_GameState.DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD:
                    // GameDebugger.addDebuggerData(GameEnum.Debugger.globalData.DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD, GetSystemTimeMS() / 1000);
                    break;
                // -- 游戏初始化
                case DOTA_GameState.DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP:
                    // GameDebugger.addDebuggerData(GameEnum.Debugger.globalData.DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP, GetSystemTimeMS() / 1000);
                    // GameDebugger.GetInstance().debugger_OnPlayerDisconnect();
                    await this.PlayerSystem().StartGame();
                    break;
                // 	-- 选择英雄,可以获取玩家数量
                case DOTA_GameState.DOTA_GAMERULES_STATE_HERO_SELECTION:
                    break;
                // 	-- 策略时间 创建初始英雄，调用初始英雄脚本
                case DOTA_GameState.DOTA_GAMERULES_STATE_STRATEGY_TIME:
                    break;
                // 	队伍阵容调整阶段
                case DOTA_GameState.DOTA_GAMERULES_STATE_TEAM_SHOWCASE:
                    break;
                // 	地图加载阶段
                case DOTA_GameState.DOTA_GAMERULES_STATE_WAIT_FOR_MAP_TO_LOAD:
                    break;
                // 	-- 准备阶段(进游戏，刷怪前)
                case DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME:
                    break;
                // -- 游戏准备开始
                case DOTA_GameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS:
                    this.StartGame();
                    break;
                //  --游戏正式开始
                case DOTA_GameState.DOTA_GAMERULES_STATE_POST_GAME:
                    break;
            }
        });
    }
    private StartGame() {
        this.RoundSystem().StartGame();
        this.DrawSystem().StartGame();
    }
}
