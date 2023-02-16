import { BattleUnitEntityRoot } from "../BattleUnit/BattleUnitEntityRoot";

@GReloadable
export class EnemyUnitEntityRoot extends BattleUnitEntityRoot {

    onDestroy(): void {
    }
}
declare global {
    type IEnemyUnitEntityRoot = EnemyUnitEntityRoot;
    var GEnemyUnitEntityRoot: typeof EnemyUnitEntityRoot;
}

if (_G.GEnemyUnitEntityRoot == undefined) {
    _G.GEnemyUnitEntityRoot = EnemyUnitEntityRoot;
}