import { LogHelper } from "../../../helper/LogHelper";
import { registerET, ET } from "../../../libs/Entity";
import { PlayerScene } from "../Player/PlayerScene";

@registerET()
export class CourierDataComponent extends ET.Component {
    onSerializeToEntity() {
        PlayerScene.GetPlayer(this.BelongPlayerid)?.AddOneComponent(this);
    }
    health: number = 100;
    maxHealth: number = 100;
    steamID: string;
    damage: number = 0;


    IsValidSteamID() {
        return this.steamID && this.steamID != "0";
    }
}