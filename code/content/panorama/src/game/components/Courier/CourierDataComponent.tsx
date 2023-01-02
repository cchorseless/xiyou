import { CourierData } from "../../../../../scripts/tscripts/shared/rules/Courier/CourierData";

@GReloadable
export class CourierDataComponent extends CourierData {


    IsValidSteamID() {
        return this.steamID && this.steamID != "0";
    }
}