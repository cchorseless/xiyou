import { KVHelper } from "../../../helper/KVHelper";
import { BattleUnitEntityRoot } from "../BattleUnit/BattleUnitEntityRoot";

@GReloadable
export class BuildingEntityRoot extends BattleUnitEntityRoot {

    Config() {
        return (KVHelper.KVData()).building_unit_tower[this.ConfigID];
    }
}
declare global {
    type IBuildingEntityRoot = BuildingEntityRoot;
    var GBuildingEntityRoot: typeof BuildingEntityRoot;
}

if (_G.GBuildingEntityRoot == undefined) {
    _G.GBuildingEntityRoot = BuildingEntityRoot;
}