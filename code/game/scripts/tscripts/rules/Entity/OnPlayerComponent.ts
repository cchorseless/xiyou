import { PlayerScene } from "../Components/Player/PlayerScene";
import { ET } from "./Entity";

export class OnPlayerComponent extends ET.Component {

    static GetSelf<T extends typeof OnPlayerComponent>(this: T, playerid: PlayerID): InstanceType<T> {
        return GPlayerSystem.GetInstance().GetPlayer(playerid).GetComponent(this)
    }

    GetPlayerID() {
        return this.GetDomain<PlayerScene>().ETRoot.Playerid;
    }

    GetRoot() {
        return this.GetDomain<PlayerScene>().ETRoot
    }
}