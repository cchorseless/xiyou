
import { BaseEntityRoot } from "../../../libs/BaseEntityRoot";

@GReloadable
export class CourierEntityRoot extends BaseEntityRoot {
    health: number = 100;
    maxHealth: number = 100;
    steamID: string;
    damage: number = 0;

    IsValidSteamID() {
        return this.steamID != null && this.steamID.length > 1;
    }
}
declare global {
    type ICourierEntityRoot = CourierEntityRoot;
    var GCourierEntityRoot: typeof CourierEntityRoot;
}

if (_G.GCourierEntityRoot == undefined) {
    _G.GCourierEntityRoot = CourierEntityRoot;
}