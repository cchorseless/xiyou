import { BattleUnitEntityRoot } from "../BattleUnit/BattleUnitEntityRoot";
import { EnemyDataComponent } from "./EnemyDataComponent";

@GReloadable
export class EnemyUnitEntityRoot extends BattleUnitEntityRoot {
    get EnemyUnitComp() {
        return this.GetComponentByName<EnemyDataComponent>("EnemyDataComponent");
    }
}
declare global {
    type IEnemyUnitEntityRoot = EnemyUnitEntityRoot;
    var GEnemyUnitEntityRoot: typeof EnemyUnitEntityRoot;
}

if (_G.GEnemyUnitEntityRoot == undefined) {
    _G.GEnemyUnitEntityRoot = EnemyUnitEntityRoot;
}