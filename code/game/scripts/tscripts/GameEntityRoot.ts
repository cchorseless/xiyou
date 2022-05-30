/**
 * 解决循环引用折中方案，出现循环应用，这里添加引用后，再引用该模块。
 * 弃用，采用缓存类的形式
 */

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
}
