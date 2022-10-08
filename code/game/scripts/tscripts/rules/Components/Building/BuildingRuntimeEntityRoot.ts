import { BuildingEntityRoot } from "./BuildingEntityRoot";

export class BuildingRuntimeEntityRoot extends BuildingEntityRoot {
    IsRuntimeBuilding(): boolean {
        return true;
    }
}