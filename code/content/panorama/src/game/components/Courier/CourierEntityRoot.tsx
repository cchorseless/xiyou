
import { BattleUnitEntityRoot } from "../BattleUnit/BattleUnitEntityRoot";

@GReloadable
export class CourierEntityRoot extends BattleUnitEntityRoot { }
declare global {
    type ICourierEntityRoot = CourierEntityRoot;
    var GCourierEntityRoot: typeof CourierEntityRoot;
}

if (_G.GCourierEntityRoot == undefined) {
    _G.GCourierEntityRoot = CourierEntityRoot;
}