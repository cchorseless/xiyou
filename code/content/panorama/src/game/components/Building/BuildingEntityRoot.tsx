import { KVHelper } from "../../../helper/KVHelper";
import { ET } from "../../../../../scripts/tscripts/shared/lib/Entity";
import { BattleUnitEntityRoot } from "../BattleUnit/BattleUnitEntityRoot";
import { BuildingComponent } from "./BuildingComponent";

@GReloadable
export class BuildingEntityRoot extends BattleUnitEntityRoot {

    Config() {
        return (KVHelper.KVData()).building_unit_tower[this.ConfigID];
    }
    get BuildingComp() {
        return this.GetComponentByName<BuildingComponent>("BuildingComponent");
    }
}
declare global {
    type IBuildingEntityRoot = BuildingEntityRoot;
    var GBuildingEntityRoot: typeof BuildingEntityRoot;
}

if (_G.GBuildingEntityRoot == undefined) {
    _G.GBuildingEntityRoot = BuildingEntityRoot;
}