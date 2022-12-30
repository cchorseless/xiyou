import { ET } from "../../../../../scripts/tscripts/shared/lib/Entity";
import { BattleUnitEntityRoot } from "../BattleUnit/BattleUnitEntityRoot";
import { EnemyUnitComponent } from "./EnemyUnitComponent";

@GReloadable
export class EnemyUnitEntityRoot extends BattleUnitEntityRoot {
    get EnemyUnitComp() {
        return this.GetComponentByName<EnemyUnitComponent>("EnemyUnitComponent");
    }
}
declare global {
    type IEnemyUnitEntityRoot = EnemyUnitEntityRoot;
    var GEnemyUnitEntityRoot: typeof EnemyUnitEntityRoot;
}

if (_G.GEnemyUnitEntityRoot == undefined) {
    _G.GEnemyUnitEntityRoot = EnemyUnitEntityRoot;
}