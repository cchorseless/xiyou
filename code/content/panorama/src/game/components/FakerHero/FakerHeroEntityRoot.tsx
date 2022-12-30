import { BaseEntityRoot } from "../../../libs/BaseEntityRoot";
import { FHeroCombinationManagerComponent } from "./FHeroCombinationManagerComponent";


@GReloadable
export class FakerHeroEntityRoot extends BaseEntityRoot {

    get FHeroCombinationManager() {
        return this.GetComponentByName<FHeroCombinationManagerComponent>("FHeroCombinationManagerComponent")!;
    }
}


declare global {
    type IFakerHeroEntityRoot = FakerHeroEntityRoot;
    var GFakerHeroEntityRoot: typeof FakerHeroEntityRoot;
}

if (_G.GFakerHeroEntityRoot == undefined) {
    _G.GFakerHeroEntityRoot = FakerHeroEntityRoot;
}