import { BaseEntityRoot } from "../../../libs/BaseEntityRoot";

@GReloadable
export class AbilityEntityRoot extends BaseEntityRoot {

}
declare global {
    type IAbilityEntityRoot = AbilityEntityRoot;
    var GAbilityEntityRoot: typeof AbilityEntityRoot;
}

if (_G.GAbilityEntityRoot == undefined) {
    _G.GAbilityEntityRoot = AbilityEntityRoot;
}