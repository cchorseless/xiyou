import { BaseEntityRoot } from "../../../libs/BaseEntityRoot";


@GReloadable
export class FakerHeroEntityRoot extends BaseEntityRoot {

}


declare global {
    type IFakerHeroEntityRoot = FakerHeroEntityRoot;
    var GFakerHeroEntityRoot: typeof FakerHeroEntityRoot;
}

if (_G.GFakerHeroEntityRoot == undefined) {
    _G.GFakerHeroEntityRoot = FakerHeroEntityRoot;
}