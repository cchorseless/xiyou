import { BaseNpc_Hero_Plus } from "../../npc/entityPlus/BaseNpc_Hero_Plus";
import { CourierEntityRoot } from "../Components/Courier/CourierEntityRoot";
import { ET } from "./Entity";

export class BaseNpcComponent extends ET.Component {

    static GetSelf<T extends typeof BaseNpcComponent>(this: T, playerid: PlayerID): InstanceType<T> {
        return GPlayerSystem.GetInstance().GetPlayer(playerid).Hero.ETRoot.GetComponent(this)
    }

    GetPlayerID() {
        return this.GetDomain<BaseNpc_Hero_Plus>().ETRoot.As<CourierEntityRoot>().Playerid;
    }
}