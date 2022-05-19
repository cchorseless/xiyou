import { ClassHelper } from "../../../helper/ClassHelper";
import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { ET } from "../../Entity/Entity";
import { DrawComponent } from "../Draw/DrawComponent";
import { RoundManagerComponent } from "../Round/RoundManagerComponent";
import { PlayerComponent } from "./PlayerComponent";
import { PlayerHttpComponent } from "./PlayerHttpComponent";

export class PlayerEntityRoot extends ET.EntityRoot {
    readonly Playerid: PlayerID;
    PlayerComp() {
        return this.GetComponent(ClassHelper.getRegClass<typeof PlayerComponent>("PlayerComponent"));
    }
    PlayerHttpComp() {
        return this.GetComponent(ClassHelper.getRegClass<typeof PlayerHttpComponent>("PlayerHttpComponent"));
    }
    DrawComp() {
        return this.GetComponent(ClassHelper.getRegClass<typeof DrawComponent>("DrawComponent"));
    }
    RoundManagerComp() {
        return this.GetComponent(ClassHelper.getRegClass<typeof RoundManagerComponent>("RoundManagerComponent"));
    }

    GetHero() {
        return this.Domain as BaseNpc_Hero_Plus;
    }

    CheckIsAlive() {
        return this.GetHero().IsAlive();
    }
}
