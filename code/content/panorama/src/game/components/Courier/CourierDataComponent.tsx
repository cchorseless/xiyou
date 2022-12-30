import { CourierData } from "../../../../../scripts/tscripts/shared/rules/Courier/CourierData";

@GReloadable
export class CourierDataComponent extends CourierData {
    onSerializeToEntity() {
        GGameScene.GetPlayer(this.BelongPlayerid)?.AddOneComponent(this);
    }

    IsValidSteamID() {
        return this.steamID && this.steamID != "0";
    }
}