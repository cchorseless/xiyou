import { BaseEntityRoot } from "../../../libs/BaseEntityRoot";

@GReloadable
export class ItemEntityRoot extends BaseEntityRoot {

}
declare global {
    type IItemEntityRoot = ItemEntityRoot;
    var GItemEntityRoot: typeof ItemEntityRoot;
}

if (_G.GItemEntityRoot == undefined) {
    _G.GItemEntityRoot = ItemEntityRoot;
}