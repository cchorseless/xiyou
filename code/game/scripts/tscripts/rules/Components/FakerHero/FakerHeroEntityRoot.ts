import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { PlayerCreateUnitEntityRoot } from "../Player/PlayerCreateUnitEntityRoot";
import { FHeroCombinationManagerComponent } from "./FHeroCombinationManagerComponent";

export class FakerHeroEntityRoot extends PlayerCreateUnitEntityRoot {
    onAwake() {
        this.AddComponent(PrecacheHelper.GetRegClass<typeof FHeroCombinationManagerComponent>("FHeroCombinationManagerComponent"));
    }

    FHeroCombinationManager() {
        return this.GetComponentByName<FHeroCombinationManagerComponent>("FHeroCombinationManagerComponent");
    }
}