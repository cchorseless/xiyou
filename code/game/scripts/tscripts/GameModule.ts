/**
 * 解决循环引用折中方案，出现循环应用，这里添加引用后，再引用该模块。
 * 弃用，采用缓存类的形式
 */

import { SingletonClass } from "./helper/SingletonHelper";
import { BuildingSystem } from "./rules/System/Building/BuildingSystem";
import { CombinationSystem } from "./rules/System/Combination/CombinationSystem";
import { DrawSystem } from "./rules/System/Draw/DrawSystem";
import { EnemySystem } from "./rules/System/Enemy/EnemySystem";
import { PlayerSystem } from "./rules/System/Player/PlayerSystem";
import { RoundSystem } from "./rules/System/Round/RoundSystem";

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

export class GameModule extends SingletonClass {
    init() {
        PlayerSystem.init();
        DrawSystem.init();
        // EnemySystem.init();
        // RoundSystem.init();
        // BuildingSystem.init();
        // CombinationSystem.init();
    }
}
